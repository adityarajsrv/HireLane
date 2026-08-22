const detectATS = () => {
  const host = window.location.hostname;
  if (host.includes("myworkdayjobs.com")) return "workday";
  if (host.includes("greenhouse.io")) return "greenhouse";
  if (host.includes("internshala.com")) return "internshala";
  if (host.includes("naukri.com")) return "naukri";
  if (host.includes("wellfound.com")) return "wellfound";
  return null;
};

const ATS_MODE = {
  workday: "fill",
  greenhouse: "fill",
  internshala: "track",
  naukri: "track",
  wellfound: "cover-letter",
};

const getATSMode = () => {
  const ats = detectATS();
  return ats ? ATS_MODE[ats] : null;
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

const extractWellfoundSessionKey = () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("job_listing_slug");
  if (slug) return `wellfound:${slug}`;
  return null;
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

  if (ats === "wellfound") {
    return extractWellfoundSessionKey();
  }

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

const scrapeWellfoundInfo = () => {
  const roleHeading = document.querySelector(
    "h1.inline.text-xl.font-semibold.text-black"
  );

  if (!roleHeading) {
    return {
      company: "Unknown Company",
      role: "Unknown Role",
    };
  }

  const role = roleHeading.textContent.trim();

  let company = "";

  const roleSection = roleHeading.parentElement;

  if (roleSection) {
    const companySection = roleSection.previousElementSibling;

    if (companySection) {
      const companySpan = companySection.querySelector(
        'a[href*="/company/"] span.text-sm.font-semibold.text-black'
      );

      if (companySpan) {
        company = companySpan.textContent.trim();
      }
    }
  }

  console.log("[HireLane] Wellfound extracted:", {
    company,
    role,
  });

  return {
    company: company || "Unknown Company",
    role: role || "Unknown Role",
  };
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

  if (ats === "wellfound") {
    return scrapeWellfoundInfo();
  }

  if (ats === "naukri") {
    const role = document.querySelector(".jd-header-title, .styles_jd-header-title__rZwM1, h1")
      ?.textContent?.trim() || "Unknown Role";
    const company = document.querySelector(".jd-header-comp-name, .styles_jd-header-comp-name__MvqAI, [class*='comp-name']")
      ?.textContent?.trim() || "Unknown Company";

    return { company, role };
  }

  if (ats === "internshala") {
    const role = document.querySelector(".profile, .heading_4_5, h1")
      ?.textContent?.trim() || "Unknown Role";
    const company = document.querySelector(".company_name, .link_display_like_text")
      ?.textContent?.trim() || "Unknown Company";

    return { company, role };
  }

  const titleParts = document.title.split(/[-|]/).map((s) => s.trim()).filter(Boolean);
  return {
    company: titleParts[0] || "Unknown Company",
    role: titleParts[1] || titleParts[0] || "Unknown Role",
  };
};

const scrapeJobDescriptionText = () => {
  const ats = detectATS();

  if (ats === "wellfound") {
    const roleHeading = document.querySelector("h1.text-xl.font-semibold") || document.querySelector("h1.font-semibold");
    if (roleHeading) {
      let node = roleHeading.parentElement;
      for (let i = 0; i < 8 && node; i++) {
        const text = node.innerText?.trim();
        if (text && text.length > 400) {
          return text.slice(0, 5000);
        }
        node = node.parentElement;
      }
    }
  }

  const platformSelectors = {
    naukri: ['.job-desc', '.JDC__dang-inner-html', '[class*="jobDescription"]'],
    internshala: ['.internship_details', '.text-container', '#job_description'],
  };

  if (ats === "wellfound") {
    const roleHeading = document.querySelector(
      "h1.text-xl.font-semibold"
    );

    if (roleHeading) {
      const container = roleHeading.closest(
        "div.w-full, section, main"
      );

      if (container) {
        const text = container.innerText?.trim();

        if (text && text.length > 200) {
          return text.slice(0, 5000);
        }
      }
    }
  }

  if (ats && platformSelectors[ats]) {
    for (const selector of platformSelectors[ats]) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim().length > 200) {
        return el.textContent.trim().slice(0, 5000);
      }
    }
  }

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

if (
  currentATS &&
  currentATS !== "wellfound" &&
  !(currentATS === "greenhouse" && isGreenhouseJobBoard())
) {
  const sessionKey = extractSessionKey();
  const pageInfo = scrapePageInfo();
  const jdText = scrapeJobDescriptionText();

  console.log(
    `[HireLane] Detected ATS: ${currentATS}, session: ${sessionKey}`
  );

  if (jdText.length > 200) {
    chrome.storage.local.set({
      [`jd_${sessionKey}`]: jdText,
    });
  }

  chrome.storage.local.set({
    [`pageinfo_${sessionKey}`]: pageInfo,
  });
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

if (currentATS === "wellfound") {
  console.log("[HireLane] Wellfound detected — watching for job panel changes");

  let lastCachedSlug = null;
  let wellfoundTimer = null;

  const tryCacheCurrentJob = () => {
    const sessionKey = extractWellfoundSessionKey();

    if (!sessionKey) {
      return;
    }

    const pageInfo = scrapePageInfo();

    console.log("[HireLane][Wellfound] Scrape attempt:", {
      sessionKey,
      company: pageInfo.company,
      role: pageInfo.role,
    });

    if (
      pageInfo.company === "Unknown Company" ||
      pageInfo.role === "Unknown Role"
    ) {
      console.log(
        "[HireLane][Wellfound] DOM not ready yet — retrying..."
      );

      scheduleWellfoundScrape();
      return;
    }

    if (sessionKey === lastCachedSlug) {
      return;
    }

    lastCachedSlug = sessionKey;

    const jdText = scrapeJobDescriptionText();

    console.log(
      `[HireLane] Wellfound job: ${pageInfo.company} — ${pageInfo.role}, key: ${sessionKey}`
    );

    chrome.storage.local.set({
      [`pageinfo_${sessionKey}`]: pageInfo,
    });

    if (jdText.length > 200) {
      chrome.storage.local.set({
        [`jd_${sessionKey}`]: jdText,
      });
    }
  };

  const scheduleWellfoundScrape = () => {
    clearTimeout(wellfoundTimer);

    wellfoundTimer = setTimeout(() => {
      tryCacheCurrentJob();
    }, 1000);
  };

  const observer = new MutationObserver(() => {
    scheduleWellfoundScrape();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  scheduleWellfoundScrape();
}

console.log("[HireLane] Content script loaded, ATS:", detectATS());