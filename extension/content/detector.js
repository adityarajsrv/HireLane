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

const extractSessionKey = () => {
  const ats = detectATS();
  const href = window.location.href;

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

console.log("[HireLane] Content script loaded, ATS:", detectATS());