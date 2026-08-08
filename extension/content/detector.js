const detectATS = () => {
  const host = window.location.hostname;
  if (host.includes("myworkdayjobs.com")) return "workday";
  if (host.includes("greenhouse.io"))      return "greenhouse";
  if (host.includes("lever.co"))           return "lever";
  if (host.includes("internshala.com"))    return "internshala";
  if (host.includes("naukri.com"))         return "naukri";
  return null;
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const isGreenhouseJobBoard = () => {
  return window.location.hostname === "my.greenhouse.io"
    || window.location.hostname.endsWith(".my.greenhouse.io");
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; 
  }
  return Math.abs(hash).toString(36);
};

const scrapeGreenhouseModal = () => {
  const modal = document.querySelector(
    '[role="dialog"], [aria-modal="true"], .modal, [class*="Modal"]'
  );
  if (!modal) return null;

  const roleEl = modal.querySelector("h1, h2");
  const role = roleEl?.textContent?.trim() || "";

  let company = "";
  let sib = roleEl?.nextElementSibling;
  let guard = 0; 
  while (sib && guard < 5) {
    const text = sib.textContent?.trim() || "";
    if (text.length > 0 && text.length < 60) { company = text; break; }
    sib = sib.nextElementSibling;
    guard++;
  }

  if (!role && !company) return null;
  return { role: role || "Unknown Role", company: company || "Unknown Company" };
};

const extractSessionKey = () => {
  const ats = detectATS();
  const href = window.location.href;

  if (ats === "greenhouse" && isGreenhouseJobBoard()) {
    const modalInfo = scrapeGreenhouseModal();
    if (modalInfo) {
      const jdSnippet = scrapeJobDescriptionText().slice(0, 150);
      const hashInput = `${modalInfo.company}|${modalInfo.role}|${jdSnippet}`;
      return `greenhouse:${hashString(hashInput)}`;
    }
    return null;
  }

  const reqMatch = href.match(/[_-]?(R-?\d{4,})/i);
  if (reqMatch) return `${ats}:${reqMatch[1].toUpperCase()}`;

  const jobMatch = href.match(/\/job\/([^?]+)/);
  if (jobMatch) return `${ats}:${jobMatch[1]}`;

  const genericMatch = href.match(/\/jobs?\/([a-zA-Z0-9\-]+)/);
  if (genericMatch) return `${ats}:${genericMatch[1]}`;

  return `${window.location.hostname}:${window.location.pathname.split("/").slice(0, 3).join("/")}`;
};

const scrapePageInfo = () => {
  const ats = detectATS();

  if (ats === "greenhouse" && isGreenhouseJobBoard()) {
    const modalInfo = scrapeGreenhouseModal();
    if (modalInfo) return modalInfo;
    return { company: "Unknown Company", role: "Unknown Role" };
  }

  if (ats === "workday") {
    const company = capitalize(window.location.hostname.split(".")[0] || "Unknown Company");
    const roleSelectors = [
      '[data-automation-id="jobPostingHeader"]',
      '[data-automation-id="jobPostingHeaderTitle"]',
      "h1", "h2",
    ];
    let role = "";
    for (const sel of roleSelectors) {
      const el = document.querySelector(sel);
      if (el && el.textContent.trim().length > 3) { role = el.textContent.trim(); break; }
    }
    if (!role) role = document.title.trim();
    return { company, role: role || "Unknown Role" };
  }

  if (ats === "greenhouse") {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const company = pathParts[0] ? capitalize(pathParts[0]) : "Unknown Company";
    const role = document.querySelector("h1")?.textContent?.trim() || "Unknown Role";
    return { company, role };
  }

  if (ats === "lever") {
    const company = capitalize(window.location.hostname.split(".")[0] || "Unknown Company");
    const role = document.querySelector("h1, .posting-headline h2")?.textContent?.trim() || "Unknown Role";
    return { company, role };
  }

  const titleParts = document.title.split(/[-|]/).map((s) => s.trim()).filter(Boolean);
  return {
    company: titleParts[0] || "Unknown Company",
    role: titleParts[1] || titleParts[0] || "Unknown Role",
  };
};

const scrapeJobDescriptionText = () => {
  const modal = document.querySelector('[role="dialog"], [aria-modal="true"], .modal, [class*="Modal"]');
  if (modal) {
    const modalText = modal.innerText?.trim();
    if (modalText && modalText.length > 200) return modalText.slice(0, 5000);
  }

  const candidates = [
    '[data-automation-id="jobPostingDescription"]',
    '[data-automation-id="jobPostingDescriptionText"]',
    ".job__description", ".job-description",
    "#content .section-wrapper", "main", "article",
  ];
  for (const selector of candidates) {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim().length > 200) {
      return el.textContent.trim().slice(0, 5000);
    }
  }
  return (document.body.innerText || "").trim().slice(0, 5000);
};

const currentATS = detectATS();

if (currentATS && !(currentATS === "greenhouse" && isGreenhouseJobBoard())) {
  const sessionKey = extractSessionKey();
  const pageInfo   = scrapePageInfo();
  const jdText     = scrapeJobDescriptionText();

  console.log(`[HireLane] Detected ATS: ${currentATS}, session: ${sessionKey}`);

  if (jdText.length > 200) {
    chrome.storage.local.set({ [`jd_${sessionKey}`]: jdText });
  }
  chrome.storage.local.set({ [`pageinfo_${sessionKey}`]: pageInfo });
}

if (currentATS === "greenhouse" && isGreenhouseJobBoard()) {
  console.log("[HireLane] Greenhouse job board detected — watching for modal opens");

  let lastCachedKey = null;
  let debounceTimer = null;

  const tryCacheCurrentModal = () => {
    const modalInfo = scrapeGreenhouseModal();
    if (!modalInfo) return;

    const sessionKey = extractSessionKey();
    if (!sessionKey || sessionKey === lastCachedKey) return;

    lastCachedKey = sessionKey;
    const jdText = scrapeJobDescriptionText();

    console.log(`[HireLane] Modal opened: ${modalInfo.company} — ${modalInfo.role}, session: ${sessionKey}`);

    if (jdText.length > 200) {
      chrome.storage.local.set({ [`jd_${sessionKey}`]: jdText });
    }
    chrome.storage.local.set({ [`pageinfo_${sessionKey}`]: modalInfo });
  };

  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(tryCacheCurrentModal, 400);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  tryCacheCurrentModal();
}

console.log("[HireLane] Content script loaded, ATS:", detectATS());