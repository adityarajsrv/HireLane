const API_BASE = "http://localhost:5000";

const connectSection = document.getElementById("connectSection");
const mainSection = document.getElementById("mainSection");
const confirmSection = document.getElementById("confirmSection");
const trackSection = document.getElementById("trackSection");
const coverLetterSection = document.getElementById("coverLetterSection");
const trackAtsName = document.getElementById("trackAtsName");
const trackCompanyInput = document.getElementById("trackCompanyInput");
const trackRoleInput = document.getElementById("trackRoleInput");
const trackLogBtn = document.getElementById("trackLogBtn");
const trackStatusEl = document.getElementById("trackStatusEl");
const generateCoverBtn = document.getElementById("generateCoverBtn");
const generatedCoverText = document.getElementById("generatedCoverText");
const copyCoverBtn = document.getElementById("copyCoverBtn");
const coverStatusEl = document.getElementById("coverStatusEl");
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const startFillBtn = document.getElementById("startFillBtn");
const atsStatus = document.getElementById("atsStatus");
const atsDot = document.getElementById("atsDot");
const fieldCountEl = document.getElementById("fieldCount");
const companyInput = document.getElementById("companyInput");
const roleInput = document.getElementById("roleInput");
const atsInput = document.getElementById("atsInput");
const ctcInput = document.getElementById("ctcInput");
const confirmFillBtn = document.getElementById("confirmFillBtn");
const cancelConfirmBtn = document.getElementById("cancelConfirmBtn");
const sessionResetRow = document.getElementById("sessionResetRow");
const resetSessionBtn = document.getElementById("resetSessionBtn");


let extractedFields = null;
let currentSessionData = null;

const showSection = (name) => {
  connectSection.style.display =
    name === "connect" ? "block" : "none";

  mainSection.style.display =
    name === "main" ? "block" : "none";

  confirmSection.style.display =
    name === "confirm" ? "block" : "none";

  trackSection.style.display =
    name === "track" ? "block" : "none";

  coverLetterSection.style.display =
    name === "cover-letter" ? "block" : "none";
};
const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

const init = async () => {
  const { hirelaneToken } = await chrome.storage.local.get("hirelaneToken");
  if (!hirelaneToken) { showSection("connect"); return; }

  showSection("main");

  try {
    const profRes = await fetch(`${API_BASE}/api/profile`, {
      headers: { "Authorization": `Bearer ${hirelaneToken}` },
    });
    const profData = await profRes.json();

    if (profData.profile && profData.profile.extensionEnabled === false) {
      atsStatus.textContent = "Extension disabled in HireLane settings";
      atsDot.style.background = "#e24b4a";
      startFillBtn.disabled = true;
      return;
    }
  } catch {
  }

  const tab = await getActiveTab();

  let stateRes;

  try {
    stateRes = await chrome.tabs.sendMessage(
      tab.id,
      { action: "GET_STATE" }
    );
  } catch {
    stateRes = null;
  }

  if (!stateRes?.ats) {
    atsStatus.textContent = "No supported ATS on this page";
    atsDot.style.background = "#e24b4a";

    startFillBtn.style.display = "none";
    trackSection.style.display = "none";
    coverLetterSection.style.display = "none";

    return;
  }

  atsStatus.textContent = `Detected: ${stateRes.ats}`;
  atsDot.style.background = "#1bd29c";

  // Hide everything first
  startFillBtn.style.display = "none";
  trackSection.style.display = "none";
  coverLetterSection.style.display = "none";

  // Route according to ATS mode
  if (stateRes.mode === "fill") {
    startFillBtn.style.display = "block";
    startFillBtn.disabled = false;

  } else if (stateRes.mode === "track") {
    trackSection.style.display = "block";

    trackAtsName.textContent =
      stateRes.ats.charAt(0).toUpperCase() +
      stateRes.ats.slice(1);

    trackCompanyInput.value =
      stateRes.pageInfo?.company === "Unknown Company"
        ? ""
        : stateRes.pageInfo?.company || "";

    trackRoleInput.value =
      stateRes.pageInfo?.role === "Unknown Role"
        ? ""
        : stateRes.pageInfo?.role || "";

  } else if (stateRes.mode === "cover-letter") {
    coverLetterSection.style.display = "block";
  }
};

connectBtn.addEventListener("click", async () => {
  const email = prompt("HireLane email:");
  const password = prompt("HireLane password:");
  if (!email || !password) return;

  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const loginData = await loginRes.json();
    if (!loginData.success) { alert(loginData.message || "Login failed"); return; }

    const tokenRes = await fetch(`${API_BASE}/auth/extension-token`, { method: "POST", credentials: "include" });
    const tokenData = await tokenRes.json();
    if (!tokenData.success) { alert("Could not get extension token"); return; }

    await chrome.storage.local.set({ hirelaneToken: tokenData.token });
    init();
  } catch (err) {
    alert("Connection failed: " + err.message);
  }
});

disconnectBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove("hirelaneToken");
  init();
});

trackLogBtn.addEventListener("click", async () => {
  const company = trackCompanyInput.value.trim();
  const role = trackRoleInput.value.trim();

  if (!company || !role) {
    trackStatusEl.textContent = "Company and role are required.";
    trackStatusEl.style.color = "#e24b4a";
    return;
  }

  trackLogBtn.disabled = true;
  trackLogBtn.textContent = "Tracking...";
  trackStatusEl.textContent = "";

  try {
    const tab = await getActiveTab();

    const { hirelaneToken } =
      await chrome.storage.local.get("hirelaneToken");

    const stateRes = await chrome.tabs.sendMessage(
      tab.id,
      { action: "GET_STATE" }
    );

    const response = await fetch(
      `${API_BASE}/api/applications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${hirelaneToken}`,
        },
        body: JSON.stringify({
          company,
          role,
          ats: stateRes.ats,
          status: "applied",
          sessionKey: stateRes.sessionKey,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to track application."
      );
    }

    trackStatusEl.textContent = "Application tracked.";
    trackStatusEl.style.color = "#1bd29c";

    trackLogBtn.textContent = "Tracked ✓";

  } catch (err) {
    trackStatusEl.textContent =
      "Error: " + err.message;

    trackStatusEl.style.color = "#e24b4a";

    trackLogBtn.disabled = false;
    trackLogBtn.textContent = "Track This Application";
  }
});

generateCoverBtn.addEventListener("click", async () => {
  generateCoverBtn.disabled = true;
  generateCoverBtn.textContent = "Generating...";
  coverStatusEl.textContent = "";

  try {
    const tab = await getActiveTab();

    const { hirelaneToken } =
      await chrome.storage.local.get("hirelaneToken");

    const stateRes = await chrome.tabs.sendMessage(
      tab.id,
      { action: "GET_STATE" }
    );

    const jdRes = await chrome.tabs.sendMessage(
      tab.id,
      { action: "GET_JD_TEXT" }
    );

    const jobDescription =
      jdRes?.jobDescription || "";

    if (jobDescription.length < 100) {
      throw new Error(
        "Could not read enough of the job description."
      );
    }

    const coverRes = await fetch(
      `${API_BASE}/api/generate-cover`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${hirelaneToken}`,
        },
        body: JSON.stringify({
          jobDescription,
          company: stateRes.pageInfo?.company,
          role: stateRes.pageInfo?.role,
        }),
      }
    );

    const coverData = await coverRes.json();

    if (!coverRes.ok || !coverData.success) {
      throw new Error(
        coverData.message ||
        "Cover letter generation failed."
      );
    }

    generatedCoverText.value =
      coverData.coverLetter || "";

    generatedCoverText.style.display = "block";
    copyCoverBtn.style.display = "block";

    coverStatusEl.textContent =
      "Cover letter generated.";

    coverStatusEl.style.color = "#1bd29c";

    // Log Wellfound application
    const applicationRes = await fetch(
      `${API_BASE}/api/applications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${hirelaneToken}`,
        },
        body: JSON.stringify({
          company: stateRes.pageInfo?.company,
          role: stateRes.pageInfo?.role,
          ats: "wellfound",
          status: "applied",
          sessionKey: stateRes.sessionKey,
          coverLetter: coverData.coverLetter,
        }),
      }
    );

    if (!applicationRes.ok) {
      console.warn(
        "[HireLane] Cover letter generated but application logging failed."
      );
    }

  } catch (err) {
    coverStatusEl.textContent =
      "Error: " + err.message;

    coverStatusEl.style.color = "#e24b4a";
  } finally {
    generateCoverBtn.disabled = false;
    generateCoverBtn.textContent =
      "Generate Cover Letter";
  }
});

copyCoverBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      generatedCoverText.value
    );

    coverStatusEl.textContent =
      "Copied to clipboard!";

    coverStatusEl.style.color = "#1bd29c";

  } catch (err) {
    coverStatusEl.textContent =
      "Could not copy. Select the text manually.";

    coverStatusEl.style.color = "#e24b4a";
  }
});

startFillBtn.addEventListener("click", async () => {
  startFillBtn.disabled = true;
  startFillBtn.textContent = "Reading page...";

  try {
    const tab = await getActiveTab();
    const { hirelaneToken } = await chrome.storage.local.get("hirelaneToken");

    const extractRes = await chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_FIELDS" });
    extractedFields = extractRes.fields;
    currentSessionData = { ats: extractRes.ats, sessionKey: extractRes.sessionKey };

    if (!extractedFields || extractedFields.length === 0) {
      alert("No fillable fields found on this page.");
      return;
    }

    let prefillCompany = extractRes.pageInfo.company;
    let prefillRole = extractRes.pageInfo.role;

    if (extractRes.sessionKey) {
      try {
        const checkRes = await fetch(
          `${API_BASE}/api/applications?sessionKey=${encodeURIComponent(extractRes.sessionKey)}`,
          { headers: { "Authorization": `Bearer ${hirelaneToken}` } }
        );
        const checkData = await checkRes.json();
        const existing = checkData.applications?.[0];
        if (existing) {
          prefillCompany = existing.company;
          prefillRole = existing.role;
          fieldCountEl.textContent = "Continuing your in-progress application.";
          fieldCountEl.style.color = "#5b3df5";
          sessionResetRow.style.display = "block";
        } else {
          fieldCountEl.textContent = "";
          sessionResetRow.style.display = "none";
        }
      } catch {
      }
    }

    companyInput.value = prefillCompany === "Unknown Company" ? "" : prefillCompany;
    roleInput.value = prefillRole === "Unknown Role" ? "" : prefillRole;
    atsInput.value = extractRes.ats || "other";
    ctcInput.value = "";

    showSection("confirm");
  } catch (err) {
    alert("Error reading page: " + err.message);
  } finally {
    startFillBtn.disabled = false;
    startFillBtn.textContent = "Fill Application";
  }
});

cancelConfirmBtn.addEventListener("click", () => {
  extractedFields = null;
  currentSessionData = null;
  showSection("main");
});

confirmFillBtn.addEventListener("click", async () => {
  const company = companyInput.value.trim();
  const role = roleInput.value.trim();
  const ats = atsInput.value;

  if (!company || !role) {
    fieldCountEl.textContent = "Company and role are required.";
    fieldCountEl.style.color = "#e24b4a";
    return;
  }

  confirmFillBtn.disabled = true;
  confirmFillBtn.textContent = "Filling...";
  fieldCountEl.style.color = "#9ca3af";

  try {
    const tab = await getActiveTab();
    const { hirelaneToken } = await chrome.storage.local.get("hirelaneToken");

    fieldCountEl.textContent = `Classifying ${extractedFields.length} fields...`;

    const classifyRes = await fetch(`${API_BASE}/api/classify-fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${hirelaneToken}` },
      body: JSON.stringify({ ats, fields: extractedFields }),
    });
    const classifyData = await classifyRes.json();

    if (!classifyData.success) {
      fieldCountEl.textContent = "Classification failed: " + classifyData.message;
      fieldCountEl.style.color = "#e24b4a";
      return;
    }

    const mergedFields = extractedFields
      .map((f) => {
        const c = classifyData.classifications[f.label];
        if (!c) return null;
        return { label: f.label, selector: f.selector, profileKey: c.profileKey };
      })
      .filter(Boolean);

    const profileRes = await fetch(`${API_BASE}/api/profile`, {
      headers: { "Authorization": `Bearer ${hirelaneToken}` },
    });
    const profileData = await profileRes.json();

    if (!profileData.profile) {
      fieldCountEl.textContent = "No profile found. Upload your resume first.";
      fieldCountEl.style.color = "#e24b4a";
      return;
    }

    fieldCountEl.textContent = `Filling ${mergedFields.length} fields...`;

    const fillRes = await chrome.tabs.sendMessage(tab.id, {
      action: "FILL_ALL",
      mergedFields,
      profile: profileData.profile,
    });

    let matchScore = null;

    try {
      const jdRes = await chrome.tabs.sendMessage(tab.id, {
        action: "GET_JD_TEXT",
      });

      let jobDescription = jdRes?.jobDescription || "";

      if (
        jobDescription.length < 200 &&
        currentSessionData?.sessionKey
      ) {
        const cacheKey = `jd_${currentSessionData.sessionKey}`;
        const cached = await chrome.storage.local.get(cacheKey);

        if (cached[cacheKey]) {
          jobDescription = cached[cacheKey];
          console.log("[HireLane] Using cached job description");
        }
      }

      if (jobDescription.length > 100) {
        const scoreRes = await fetch(`${API_BASE}/api/jdmatch/score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${hirelaneToken}`,
          },
          body: JSON.stringify({
            jobDescription,
          }),
        });

        const scoreData = await scoreRes.json();

        if (scoreData.success) {
          matchScore = scoreData.score;
        }
      }
    } catch {
    }

    fieldCountEl.textContent = `Filled ${fillRes.filledCount} of ${extractedFields.length} fields.`;
    fieldCountEl.style.color = "#1bd29c";

    await fetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${hirelaneToken}` },
      body: JSON.stringify({
        company, role, ats,
        status: "applied",
        sessionKey: currentSessionData?.sessionKey || null,
        matchScore,
      }),
    });

  } catch (err) {
    fieldCountEl.textContent = "Error: " + err.message;
    fieldCountEl.style.color = "#e24b4a";
    console.error(err);
  } finally {
    confirmFillBtn.disabled = false;
    confirmFillBtn.textContent = "Continue & Fill";
  }
});

resetSessionBtn.addEventListener("click", () => {
  if (currentSessionData) currentSessionData.sessionKey = null;
  fieldCountEl.textContent = "Treating this as a new application.";
  fieldCountEl.style.color = "#5b3df5";
  sessionResetRow.style.display = "none";
});

init();