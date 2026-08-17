const API_BASE = "http://localhost:5000";

const authenticatedFetch = async (url, options = {}) => {
  const { hirelaneToken } =
    await chrome.storage.local.get("hirelaneToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${hirelaneToken}`,
    },
  });

  if (res.status === 401) {
    await chrome.storage.local.remove("hirelaneToken");

    await init();

    throw new Error(
      "Session expired. Please sign in again."
    );
  }

  return res;
};

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
const pairCodeInput = document.getElementById("pairCodeInput");
const loginErrorEl = document.getElementById("loginErrorEl");

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

// ── Connect using dashboard pairing code ──
connectBtn.addEventListener("click", async () => {
  const code = pairCodeInput.value.trim();

  loginErrorEl.style.display = "none";
  loginErrorEl.textContent = "";

  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    loginErrorEl.textContent =
      "Enter the 6-digit code from your dashboard.";
    loginErrorEl.style.display = "block";
    return;
  }

  connectBtn.disabled = true;
  connectBtn.textContent = "Connecting...";

  try {
    const res = await fetch(
      `${API_BASE}/auth/extension-pair/redeem`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      loginErrorEl.textContent =
        data.message || "Invalid or expired pairing code.";
      loginErrorEl.style.display = "block";
      return;
    }

    await chrome.storage.local.set({
      hirelaneToken: data.token,
    });

    pairCodeInput.value = "";

    await init();
  } catch (err) {
    loginErrorEl.textContent =
      "Connection failed: " + err.message;
    loginErrorEl.style.display = "block";
  } finally {
    connectBtn.disabled = false;
    connectBtn.textContent = "Connect";
  }
});

pairCodeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    connectBtn.click();
  }
});

// ── Connect using dashboard pairing code ──
connectBtn.addEventListener("click", async () => {
  const code = pairCodeInput.value.trim();

  loginErrorEl.style.display = "none";
  loginErrorEl.textContent = "";

  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    loginErrorEl.textContent =
      "Enter the 6-digit code from your dashboard.";
    loginErrorEl.style.display = "block";
    return;
  }

  connectBtn.disabled = true;
  connectBtn.textContent = "Connecting...";

  try {
    const res = await fetch(
      `${API_BASE}/auth/extension-pair/redeem`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      loginErrorEl.textContent =
        data.message || "Invalid or expired pairing code.";
      loginErrorEl.style.display = "block";
      return;
    }

    await chrome.storage.local.set({
      hirelaneToken: data.token,
    });

    pairCodeInput.value = "";

    await init();
  } catch (err) {
    loginErrorEl.textContent =
      "Connection failed: " + err.message;
    loginErrorEl.style.display = "block";
  } finally {
    connectBtn.disabled = false;
    connectBtn.textContent = "Connect";
  }
});

pairCodeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    connectBtn.click();
  }
});

disconnectBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove("hirelaneToken");
  init();
});

// popup.js — update trackLogBtn's click handler to also compute a score

document.getElementById("trackLogBtn").addEventListener("click", async () => {
  const company = document.getElementById("trackCompanyInput").value.trim();
  const role    = document.getElementById("trackRoleInput").value.trim();
  const statusEl = document.getElementById("trackStatusEl");

  if (!company || !role) {
    statusEl.textContent = "Company and role are required.";
    statusEl.style.color = "#e24b4a";
    return;
  }

  statusEl.textContent = "Scoring and tracking...";
  statusEl.style.color = "#9ca3af";

  try {
    const tab = await getActiveTab();
    const stateRes = await chrome.tabs.sendMessage(tab.id, { action: "GET_STATE" });

    // ── NEW: attempt scoring before logging, same pattern as the
    // fill flow already uses. Naukri/Internshala JD content is
    // usually readable directly (not hidden behind a modal), so this
    // works without the cross-tab caching complexity Greenhouse needed.
    let matchScore = null;
    try {
      const jdRes = await chrome.tabs.sendMessage(tab.id, { action: "GET_JD_TEXT" });
      if (jdRes?.jobDescription?.length > 100) {
        const scoreRes = await authenticatedFetch(`${API_BASE}/api/jdmatch/score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: jdRes.jobDescription }),
        });
        const scoreData = await scoreRes.json();
        if (scoreData.success) matchScore = scoreData.score;
      }
    } catch {
      // scoring is a nice-to-have here — tracking still proceeds without it
    }

    await authenticatedFetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company, role,
        ats: stateRes.ats,
        status: "applied",
        sessionKey: stateRes.sessionKey,
        matchScore, // ← now populated when scoring succeeds
      }),
    });

    statusEl.textContent = matchScore
      ? `Tracked — ${matchScore}% match.`
      : "Application tracked.";
    statusEl.style.color = "#1bd29c";
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
    statusEl.style.color = "#e24b4a";
  }
});

// popup.js — replace the entire generateCoverBtn handler

let lastGeneratedCover = null; // holds state between "generate" and "track" clicks
let lastGeneratedScore = null;

document.getElementById("generateCoverBtn").addEventListener("click", async () => {
  const btn = document.getElementById("generateCoverBtn");
  const textArea = document.getElementById("generatedCoverText");
  const copyBtn = document.getElementById("copyCoverBtn");
  const trackBtn = document.getElementById("trackWellfoundBtn");
  const statusEl = document.getElementById("coverStatusEl");

  btn.disabled = true;
  btn.textContent = "Generating...";
  trackBtn.style.display = "none"; // hide tracking option while generating

  try {
    const tab = await getActiveTab();
    const stateRes = await chrome.tabs.sendMessage(tab.id, { action: "GET_STATE" });
    const jdRes = await chrome.tabs.sendMessage(tab.id, { action: "GET_JD_TEXT" });

    const coverRes = await authenticatedFetch(`${API_BASE}/api/generate-cover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription: jdRes?.jobDescription || "",
        company: stateRes.pageInfo.company,
        role: stateRes.pageInfo.role,
        source: "extension",
      }),
    });
    const coverData = await coverRes.json();

    if (!coverData.success) {
      statusEl.textContent = coverData.message || "Generation failed.";
      statusEl.style.color = "#e24b4a";
      return;
    }

    // ── NEW: also compute a match score alongside generation, using
    // the same JD text — no reason to make two separate scrape calls
    lastGeneratedScore = null;
    if (jdRes?.jobDescription?.length > 100) {
      try {
        const scoreRes = await authenticatedFetch(`${API_BASE}/api/jdmatch/score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: jdRes.jobDescription }),
        });
        const scoreData = await scoreRes.json();
        if (scoreData.success) lastGeneratedScore = scoreData.score;
      } catch {
        // non-critical
      }
    }

    lastGeneratedCover = {
      text: coverData.coverLetter,
      company: stateRes.pageInfo.company,
      role: stateRes.pageInfo.role,
      sessionKey: stateRes.sessionKey,
    };

    textArea.value = coverData.coverLetter;
    textArea.style.display = "block";
    copyBtn.style.display = "block";
    trackBtn.style.display = "block"; // ← now shown, but NOT auto-clicked
    statusEl.textContent = lastGeneratedScore
      ? `Draft ready — ${lastGeneratedScore}% match. Not tracked yet.`
      : "Draft ready. Not tracked yet.";
    statusEl.style.color = "#5b3df5";

  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
    statusEl.style.color = "#e24b4a";
  } finally {
    btn.disabled = false;
    btn.textContent = "Generate Cover Letter";
  }
});

// ── NEW: separate, explicit action — this is the ONLY place a
// Wellfound application actually gets logged. Generating a draft is
// not the same as applying; the user confirms intent with this
// dedicated click, which is the honest UX your original design lacked.
document.getElementById("trackWellfoundBtn").addEventListener("click", async () => {
  const trackBtn = document.getElementById("trackWellfoundBtn");
  const statusEl = document.getElementById("coverStatusEl");

  if (!lastGeneratedCover) return;

  trackBtn.disabled = true;
  trackBtn.textContent = "Tracking...";

  try {
    await authenticatedFetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: lastGeneratedCover.company,
        role: lastGeneratedCover.role,
        ats: "wellfound",
        status: "applied",
        sessionKey: lastGeneratedCover.sessionKey,
        coverLetter: lastGeneratedCover.text,
        matchScore: lastGeneratedScore,
      }),
    });

    statusEl.textContent = "Application tracked!";
    statusEl.style.color = "#1bd29c";
    trackBtn.textContent = "Tracked ✓";
    // Leave it disabled after success — prevents accidental duplicate logging
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
    statusEl.style.color = "#e24b4a";
    trackBtn.disabled = false;
    trackBtn.textContent = "I've Applied — Track This";
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