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

const buildSelector = (el, indexOrSuffix) => {
  const automationId = el.getAttribute("data-automation-id");
  if (automationId) return `[data-automation-id="${CSS.escape(automationId)}"]`;
  if (el.id) return `#${CSS.escape(el.id)}`;
  if (el.name && el.type !== "radio") return `[name="${CSS.escape(el.name)}"]`;
  el.setAttribute("data-hirelane-idx", indexOrSuffix);
  return `[data-hirelane-idx="${indexOrSuffix}"]`;
};

const extractFields = () => {
  const inputs = document.querySelectorAll("input:not([type='radio']), textarea, select");
  const fields = [];
  let idx = 0;

  inputs.forEach((el) => {
    if (el.type === "hidden" || el.disabled || el.readOnly) return;
    if (["submit", "button", "checkbox", "file"].includes(el.type)) return;

    const label = findLabelForField(el);
    if (!label) return;

    fields.push({
      label,
      type: el.tagName.toLowerCase() === "textarea" ? "textarea" : (el.type || "text"),
      selector: buildSelector(el, idx),
    });
    idx++;
  });

  const radioFields = extractRadioGroups();
  return [...fields, ...radioFields];
};

const extractRadioGroups = () => {
  const radios = document.querySelectorAll('input[type="radio"]');
  const groups = {};

  radios.forEach((radio) => {
    if (!radio.name) return;

    if (!groups[radio.name]) {
      const fieldset = radio.closest("fieldset, div[role='radiogroup'], div[data-automation-id]");
      let groupLabel = fieldset?.querySelector("legend")?.textContent?.trim();

      if (!groupLabel) {
        const automationId = fieldset?.getAttribute("data-automation-id");
        if (automationId) {
          groupLabel = automationId.split(/[_\-]/).pop()
            .replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
        }
      }
      if (!groupLabel) {
        groupLabel = fieldset?.previousElementSibling?.textContent?.trim();
      }

      groups[radio.name] = { label: groupLabel || radio.name, options: [] };
    }

    let optionText = "";
    if (radio.id) {
      const lbl = document.querySelector(`label[for="${radio.id}"]`);
      optionText = lbl?.textContent?.trim() || "";
    }
    if (!optionText) {
      optionText = radio.parentElement?.textContent?.trim() || radio.value || "";
    }

    groups[radio.name].options.push({
      value: radio.value,
      optionText,
      selector: buildSelector(radio, `radio-${radio.name}-${radio.value}`),
    });
  });

  return Object.entries(groups).map(([name, g]) => ({
    label: g.label,
    type: "radio",
    groupName: name,
    options: g.options,
  }));
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GET_STATE") {
    const ats = detectATS();

    sendResponse({
      ats,
      mode: ats ? getATSMode() : null,
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
      mode: ats ? getATSMode() : null,
      sessionKey: ats ? extractSessionKey() : null,
    });
  }

  if (message.action === "GET_JD_TEXT") {
    sendResponse({ jobDescription: scrapeJobDescriptionText() });
  }

  return true;
});