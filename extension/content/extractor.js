const findLabelForField = (el) => {
  const automationId = el.getAttribute("data-automation-id");
  if (automationId) {
    const readable = automationId.split(/[_\-]/).pop()
      .replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
    if (readable.length > 1) return readable;
  }
  if (el.id) {
    const label = document.querySelector(`label[for="${el.id}"]`);
    if (label) return label.textContent.trim();
  }
  if (el.getAttribute("aria-label")) return el.getAttribute("aria-label").trim();
  if (el.placeholder) return el.placeholder.trim();
  const container = el.closest("div, fieldset, li");
  const labelEl = container?.querySelector("label, span[class*='label'], div[class*='label']");
  if (labelEl && labelEl.textContent.trim()) return labelEl.textContent.trim();
  return null;
};

const buildSelector = (el, index) => {
  const automationId = el.getAttribute("data-automation-id");
  if (automationId) return `[data-automation-id="${CSS.escape(automationId)}"]`;
  if (el.id) return `#${CSS.escape(el.id)}`;
  if (el.name) return `[name="${CSS.escape(el.name)}"]`;
  el.setAttribute("data-hirelane-idx", index);
  return `[data-hirelane-idx="${index}"]`;
};

const extractFields = () => {
  const inputs = document.querySelectorAll("input, textarea, select");
  const fields = [];
  let idx = 0;

  inputs.forEach((el) => {
    if (el.type === "hidden" || el.disabled || el.readOnly) return;
    if (["submit", "button", "checkbox", "radio", "file"].includes(el.type)) return;

    const label = findLabelForField(el);
    if (!label) return;

    fields.push({
      label,
      type: el.tagName.toLowerCase() === "textarea" ? "textarea" : (el.type || "text"),
      selector: buildSelector(el, idx),
    });
    idx++;
  });

  return fields;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GET_STATE") {
    const ats = detectATS();
    sendResponse({
      ats,
      sessionKey: ats ? extractSessionKey() : null,
      pageInfo: scrapePageInfo(),
    });
  }

  if (message.action === "EXTRACT_FIELDS") {
    const ats = detectATS();
    sendResponse({
      fields: extractFields(),
      pageInfo: scrapePageInfo(),
      ats,
      sessionKey: ats ? extractSessionKey() : null,
    });
  }

  if (message.action === "GET_JD_TEXT") {
    sendResponse({ jobDescription: scrapeJobDescriptionText() });
  }

  return true;
});