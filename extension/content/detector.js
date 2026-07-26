const detectATS = () => {
  const host = window.location.hostname;
  if (host.includes("myworkdayjobs.com")) return "workday";
  if (host.includes("greenhouse.io"))      return "greenhouse";
  if (host.includes("lever.co"))           return "lever";
  if (host.includes("internshala.com"))    return "internshala";
  if (host.includes("naukri.com"))         return "naukri";
  return null;
};

const currentATS = detectATS();

if (currentATS) {
  chrome.storage.local.set({
    currentATS,
    currentURL: window.location.href,
    pageTitle: document.title,
  });
  console.log(`[HireLane] Detected ATS: ${currentATS}`);
} else {
  console.log("[HireLane] No supported ATS detected on this page.");
}