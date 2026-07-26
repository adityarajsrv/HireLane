const nativeInputSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, "value"
).set;

const nativeTextareaSetter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype, "value"
).set;

const fillField = (element, value) => {
  const setter = element.tagName === "TEXTAREA" ? nativeTextareaSetter : nativeInputSetter;
  setter.call(element, value);

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
};

const fillAllFields = async (classifications, profile) => {
  let filledCount = 0;

  for (const [label, data] of Object.entries(classifications)) {
    if (!data.profileKey || data.profileKey === "unknown") continue;

    const element = document.querySelector(data.selector);
    if (!element) continue;

    const value = profile[data.profileKey];
    if (value === undefined || value === null || value === "") continue;

    fillField(element, String(value));
    filledCount++;

    await new Promise((r) => setTimeout(r, 80 + Math.random() * 100));
  }

  return filledCount;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "FILL_ALL") {
    fillAllFields(message.classifications, message.profile).then((count) => {
      sendResponse({ filledCount: count });
    });
    return true;
  }
});

document.addEventListener("submit", async (e) => {
  const { currentATS, currentURL, pageTitle } = await chrome.storage.local.get([
    "currentATS", "currentURL", "pageTitle"
  ]);

  const titleParts = (pageTitle || "").split(/[-|]/).map((s) => s.trim());

  chrome.runtime.sendMessage({
    action: "LOG_APPLICATION",
    data: {
      company: titleParts[0] || "Unknown Company",
      role:    titleParts[1] || "Unknown Role",
      ats:     currentATS || "other",
      url:     currentURL,
    },
  });
}, true);