const API_BASE = "http://localhost:5000";

const connectSection   = document.getElementById("connectSection");
const mainSection      = document.getElementById("mainSection");
const confirmSection   = document.getElementById("confirmSection");
const connectBtn       = document.getElementById("connectBtn");
const disconnectBtn    = document.getElementById("disconnectBtn");
const startFillBtn     = document.getElementById("startFillBtn");
const atsStatus        = document.getElementById("atsStatus");
const atsDot           = document.getElementById("atsDot");
const fieldCountEl     = document.getElementById("fieldCount");
const companyInput     = document.getElementById("companyInput");
const roleInput        = document.getElementById("roleInput");
const atsInput         = document.getElementById("atsInput");
const ctcInput         = document.getElementById("ctcInput");
const confirmFillBtn   = document.getElementById("confirmFillBtn");
const cancelConfirmBtn = document.getElementById("cancelConfirmBtn");

let extractedFields  = null;
let currentSessionData = null;

const showSection = (name) => {
  connectSection.style.display = name === "connect" ? "block" : "none";
  mainSection.style.display    = name === "main"    ? "block" : "none";
  confirmSection.style.display = name === "confirm" ? "block" : "none";
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
  try {
    const stateRes = await chrome.tabs.sendMessage(tab.id, { action: "GET_STATE" });
    if (stateRes?.ats) {
      atsStatus.textContent = `Detected: ${stateRes.ats}`;
      atsDot.style.background = "#1bd29c";
      startFillBtn.disabled = false;
    } else {
      atsStatus.textContent = "No supported ATS on this page";
      atsDot.style.background = "#e24b4a";
      startFillBtn.disabled = true;
    }
  } catch {
    atsStatus.textContent = "No supported ATS on this page";
    atsDot.style.background = "#e24b4a";
    startFillBtn.disabled = true;
  }
};

connectBtn.addEventListener("click", async () => {
  const email    = prompt("HireLane email:");
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
    let prefillRole    = extractRes.pageInfo.role;

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
          prefillRole    = existing.role;
          fieldCountEl.textContent = "Continuing your in-progress application.";
          fieldCountEl.style.color = "#5b3df5";
        } else {
          fieldCountEl.textContent = "";
        }
      } catch {
      }
    }

    companyInput.value = prefillCompany === "Unknown Company" ? "" : prefillCompany;
    roleInput.value    = prefillRole === "Unknown Role" ? "" : prefillRole;
    atsInput.value      = extractRes.ats || "other";
    ctcInput.value      = "";

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
  const role    = roleInput.value.trim();
  const ats     = atsInput.value;

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
      const jdRes = await chrome.tabs.sendMessage(tab.id, { action: "GET_JD_TEXT" });
      if (jdRes?.jobDescription && jdRes.jobDescription.length > 100) {
        const scoreRes = await fetch(`${API_BASE}/api/jdmatch/score`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${hirelaneToken}` },
          body: JSON.stringify({ jobDescription: jdRes.jobDescription }),
        });
        const scoreData = await scoreRes.json();
        if (scoreData.success) matchScore = scoreData.score;
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

init();