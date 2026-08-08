const API_BASE = "http://localhost:5000";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "LOG_APPLICATION") {
    logApplication(message.data);
  }
  return true;
});

const getToken = async () => {
  const { hirelaneToken } = await chrome.storage.local.get("hirelaneToken");
  return hirelaneToken;
};

const logApplication = async (appData) => {
  const token = await getToken();
  if (!token) {
    console.warn("[HireLane] No auth token — cannot log application. Connect the extension first.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(appData),
    });
    const data = await res.json();
    console.log("[HireLane] Application logged:", data);
  } catch (err) {
    console.error("[HireLane] Failed to log application:", err);
  }
};

chrome.runtime.onStartup.addListener(async () => {
  const all = await chrome.storage.local.get(null);
  const jdKeys = Object.keys(all).filter((k) => k.startsWith("jd_") || k.startsWith("pageinfo_"));
  if (jdKeys.length > 100) {
    const toRemove = jdKeys.slice(0, jdKeys.length - 50);
    chrome.storage.local.remove(toRemove);
  }
});