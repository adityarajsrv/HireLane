const API_BASE = "http://localhost:5000";

const connectSection = document.getElementById("connectSection");
const mainSection = document.getElementById("mainSection");
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const fillBtn = document.getElementById("fillBtn");
const atsStatus = document.getElementById("atsStatus");
const atsDot = document.getElementById("atsDot");
const fieldCountEl = document.getElementById("fieldCount");
const companyRoleEl = document.getElementById("companyRole");

let cachedFields = null;
let cachedProfile = null;

const init = async () => {
  const { hirelaneToken } = await chrome.storage.local.get("hirelaneToken");

  if (!hirelaneToken) {
    connectSection.style.display = "block";
    mainSection.style.display = "none";
    return;
  }

  connectSection.style.display = "none";
  mainSection.style.display = "block";

  const { currentATS } = await chrome.storage.local.get("currentATS");
  if (currentATS) {
    atsStatus.textContent = `Detected: ${currentATS}`;
    atsDot.style.background = "#1bd29c";
    fillBtn.disabled = false;
  } else {
    atsStatus.textContent = "No supported ATS on this page";
    atsDot.style.background = "#e24b4a";
    fillBtn.disabled = true;
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
    if (!loginData.success) {
      alert(loginData.message || "Login failed");
      return;
    }

    const tokenRes = await fetch(`${API_BASE}/auth/extension-token`, {
      method: "POST",
      credentials: "include",
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.success) {
      alert("Could not get extension token");
      return;
    }

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

fillBtn.addEventListener("click", async () => {
  fillBtn.disabled = true;
  fillBtn.textContent = "Filling...";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const { hirelaneToken, currentATS } = await chrome.storage.local.get(["hirelaneToken", "currentATS"]);

    const extractRes = await chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_FIELDS" });
    const fields = extractRes.fields;

    if (!fields || fields.length === 0) {
      fieldCountEl.textContent = "No fillable fields found on this page.";
      fillBtn.disabled = false;
      fillBtn.textContent = "Fill All Fields";
      return;
    }

    if (extractRes.pageInfo) {
      companyRoleEl.textContent = `${extractRes.pageInfo.company} — ${extractRes.pageInfo.role}`;
    }

    fieldCountEl.textContent = `Found ${fields.length} fields. Classifying...`;

    const classifyRes = await fetch(`${API_BASE}/api/classify-fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${hirelaneToken}` },
      body: JSON.stringify({ ats: currentATS, fields }),
    });
    const classifyData = await classifyRes.json();

    if (!classifyData.success) {
      fieldCountEl.textContent = "Classification failed: " + classifyData.message;
      fillBtn.disabled = false;
      fillBtn.textContent = "Fill All Fields";
      return;
    }

    const mergedFields = fields
      .map((f) => {
        const classification = classifyData.classifications[f.label];
        if (!classification) return null;
        return {
          label: f.label,
          selector: f.selector,
          profileKey: classification.profileKey,
        };
      })
      .filter(Boolean);

    const profileRes = await fetch(`${API_BASE}/api/profile`, {
      headers: { "Authorization": `Bearer ${hirelaneToken}` },
    });
    const profileData = await profileRes.json();

    if (!profileData.profile) {
      fieldCountEl.textContent = "No profile found. Upload your resume first.";
      fillBtn.disabled = false;
      fillBtn.textContent = "Fill All Fields";
      return;
    }

    fieldCountEl.textContent = `Filling ${mergedFields.length} fields...`;

    const fillRes = await chrome.tabs.sendMessage(tab.id, {
      action: "FILL_ALL",
      mergedFields,
      profile: profileData.profile,
    });

    fieldCountEl.textContent = `Filled ${fillRes.filledCount} of ${fields.length} fields.`;
    fieldCountEl.style.color = "#1bd29c";

  } catch (err) {
    fieldCountEl.textContent = "Error: " + err.message;
    fieldCountEl.style.color = "#e24b4a";
    console.error(err);
  } finally {
    fillBtn.disabled = false;
    fillBtn.textContent = "Fill All Fields";
  }
});

init();