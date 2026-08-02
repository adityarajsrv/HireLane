const findLabelForField = (el) => {
  const automationId = el.getAttribute("data-automation-id");
  if (automationId) {
    const readable = automationId
      .split(/[_\-]/)
      .pop() 
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase();
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
}

const scrapePageInfo = () => {
  const workdayTitle = document.querySelector('[data-automation-id="jobPostingHeader"]');
  if (workdayTitle) {
    const text = workdayTitle.textContent.trim();
    const companyEl = document.querySelector('[data-automation-id="company"]')
      || document.querySelector('header a, header img[alt]');
    return {
      role: text || "Unknown Role",
      company: companyEl?.textContent?.trim() || companyEl?.alt || window.location.hostname.split(".")[0],
    };
  }

  const h1 = document.querySelector("h1");
  if (h1 && h1.textContent.trim().length > 3) {
    return {
      role: h1.textContent.trim(),
      company: document.querySelector('meta[property="og:site_name"]')?.content
        || window.location.hostname.split(".")[0],
    };
  }

  const titleParts = document.title.split(/[-|]/).map((s) => s.trim()).filter(Boolean);
  return {
    company: titleParts[0] || "Unknown Company",
    role: titleParts[1] || titleParts[0] || "Unknown Role",
  };
};

const scrapeJobDescriptionText = () => {
  const candidates = [
    '[data-automation-id="jobPostingDescription"]', 
    '.job__description',                              
    '#content .section-wrapper',                       
    'main', 'article',                                   
  ];

  for (const selector of candidates) {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim().length > 200) {
      return el.textContent.trim().slice(0, 5000);
    }
  }

  return "";
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "EXTRACT_FIELDS") {
    const fields = extractFields();
    const pageInfo = scrapePageInfo();

    sendResponse({
      fields,
      pageInfo,
    });
  } else if (message.action === "GET_JD_TEXT") {
    sendResponse({
      jobDescription: scrapeJobDescriptionText(),
    });
  }

  return true;
});