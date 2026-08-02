const extractSessionKey = () => {
  const url = window.location.href;
  const workdayMatch = url.match(/\/job\/([^?]+)/);
  if (workdayMatch) return `workday:${workdayMatch[1]}`;

  const genericMatch = url.match(/\/jobs?\/([a-zA-Z0-9\-]+)/);
  if (genericMatch) return `${detectATS()}:${genericMatch[1]}`;

  return `${window.location.hostname}${window.location.pathname.split("/").slice(0, 3).join("/")}`;
};

const currentATS = detectATS();
const sessionKey = currentATS ? extractSessionKey() : null;

if (currentATS) {
  chrome.storage.local.set({
    currentATS,
    currentURL: window.location.href,
    pageTitle: document.title,
    sessionKey, 
  });
  console.log(`[HireLane] Detected ATS: ${currentATS}, session: ${sessionKey}`);
} else {
  console.log("[HireLane] No supported ATS detected on this page.");
}