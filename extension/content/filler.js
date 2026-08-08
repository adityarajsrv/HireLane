const nativeInputSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, "value"
).set;

const nativeTextareaSetter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype, "value"
).set;

const getFieldKind = (el) => {
  if (el.tagName === "TEXTAREA") return "textarea";
  if (el.tagName === "INPUT") return "input";
  if (el.isContentEditable) return "contenteditable";
  if (el.getAttribute("aria-haspopup") === "listbox" || el.getAttribute("role") === "combobox") {
    return "dropdown";
  }
  return "unknown";
};

const fillTextLike = (element, value, kind) => {
  if (kind === "textarea") {
    nativeTextareaSetter.call(element, value);
  } else if (kind === "input") {
    nativeInputSetter.call(element, value);
  } else if (kind === "contenteditable") {
    element.textContent = value;
  }
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
};

const fillDropdown = async (element, value) => {
  element.click();
  await new Promise((r) => setTimeout(r, 300));
  const options = Array.from(document.querySelectorAll(
    '[role="option"], li[role="option"], div[role="option"]'
  ));

  const match = options.find((opt) =>
    opt.textContent.trim().toLowerCase().includes(String(value).toLowerCase())
  );

  if (match) {
    match.click();
    return true;
  }

  document.activeElement?.blur();
  document.body.click();
  return false;
};

const resolveProfileValue = (profile, key) => {
  const parts = key.split(".");
  let value = profile;

  for (const part of parts) {
    if (value == null) return null;
    value = value[part];
  }
  return value;
};

const matchRadioOption = (options, value) => {
  const valStr = String(value).toLowerCase();
  const isTruthy = valStr === "true" || valStr === "yes";
  const isFalsy = valStr === "false" || valStr === "no";

  return options.find((opt) => {
    const optText = opt.optionText.toLowerCase();

    if (isTruthy) {
      return optText.includes("yes") || optText === "true";
    }

    if (isFalsy) {
      return optText.includes("no") || optText === "false";
    }

    return (
      optText.includes(valStr) ||
      valStr.includes(optText)
    );
  });
};

const fillAllFields = async (mergedFields, profile) => {
  let filledCount = 0;

  for (const field of mergedFields) {
    if (!field.profileKey || field.profileKey === "unknown") continue;

    if (field.type === "radio") {
      const value = resolveProfileValue(profile, field.profileKey);

      if (value === undefined || value === null || value === "") {
        continue;
      }

      const match = matchRadioOption(field.options, value);

      if (match) {
        const radio = document.querySelector(match.selector);

        if (radio) {
          radio.click();
          radio.dispatchEvent(
            new Event("change", { bubbles: true })
          );
          filledCount++;
        }
      }

      await new Promise((r) => setTimeout(r, 120));
      continue;
    }

    const element = document.querySelector(field.selector);

    if (!element) continue;

    const value = resolveProfileValue(profile, field.profileKey);

    if (value === undefined || value === null || value === "") {
      continue;
    }

    const kind = getFieldKind(element);

    if (kind === "dropdown") {
      const success = await fillDropdown(element, value);

      if (success) {
        filledCount++;
      }
    } else if (kind === "unknown") {
      continue;
    } else {
      fillTextLike(element, String(value), kind);
      filledCount++;
    }

    await new Promise((r) =>
      setTimeout(r, 120 + Math.random() * 120)
    );
  }

  return filledCount;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "FILL_ALL") {
    fillAllFields(message.mergedFields, message.profile).then((count) => {
      sendResponse({ filledCount: count });
    });
    return true;
  }
});

document.addEventListener("submit", async (e) => {
  const ats = detectATS();
  if (!ats) return; 

  const sessionKey = extractSessionKey();
  const pageInfo    = scrapePageInfo();

  chrome.runtime.sendMessage({
    action: "LOG_APPLICATION",
    data: {
      company: pageInfo.company,
      role: pageInfo.role,
      ats,
      url: window.location.href,
      sessionKey,
    },
  });
}, true);