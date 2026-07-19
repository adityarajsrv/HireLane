export const MOCK_APPLICATIONS = [
  { id: "1",  company: "Meesho",   role: "Full Stack SDE",    ats: "Workday",     status: "applied",   matchScore: 71, date: "May 31" },
  { id: "2",  company: "Zepto",    role: "Platform Eng",      ats: "Greenhouse",  status: "applied",   matchScore: 88, date: "May 30" },
  { id: "3",  company: "PhonePe",  role: "SWE",               ats: "Internshala", status: "applied",   matchScore: 69, date: "May 26" },
  { id: "4",  company: "Swiggy",   role: "Backend SDE",       ats: "Workday",     status: "applied",   matchScore: 74, date: "May 24" },
  { id: "5",  company: "Zomato",   role: "Full Stack Eng",    ats: "Greenhouse",  status: "applied",   matchScore: 66, date: "May 23" },
  { id: "6",  company: "Google",   role: "SWE III",           ats: "Workday",     status: "oa",        matchScore: 67, date: "Jun 1"  },
  { id: "7",  company: "CRED",     role: "SDE II",            ats: "Greenhouse",  status: "oa",        matchScore: 77, date: "May 25" },
  { id: "8",  company: "Cashfree", role: "Backend Engineer",  ats: "Lever",       status: "oa",        matchScore: 76, date: "May 18" },
  { id: "9",  company: "Uni Cards",role: "Full Stack",        ats: "Greenhouse",  status: "oa",        matchScore: 78, date: "May 17" },
  { id: "10", company: "Slice",    role: "SDE II",            ats: "Greenhouse",  status: "oa",        matchScore: 68, date: "May 16" },
  { id: "11", company: "Stripe",   role: "SWE II",            ats: "Greenhouse",  status: "interview", matchScore: 73, date: "Jun 3"  },
  { id: "12", company: "Razorpay", role: "Backend Engineer",  ats: "Lever",       status: "interview", matchScore: 81, date: "Jun 2"  },
  { id: "13", company: "Rippling", role: "Backend Eng",       ats: "Greenhouse",  status: "interview", matchScore: 84, date: "May 8"  },
  { id: "14", company: "Juspay",   role: "SDE II",            ats: "Lever",       status: "rejected",  matchScore: 54, date: "May 29" },
  { id: "15", company: "Flipkart", role: "SDE II",            ats: "Workday",     status: "rejected",  matchScore: 61, date: "May 28" },
  { id: "16", company: "Ola",      role: "SWE III",           ats: "Workday",     status: "rejected",  matchScore: 55, date: "May 15" },
  { id: "17", company: "Paytm",    role: "Backend Dev",       ats: "Naukri",      status: "rejected",  matchScore: 51, date: "May 14" },
  { id: "18", company: "Setu",     role: "Backend SDE",       ats: "Greenhouse",  status: "offer",     matchScore: 92, date: "May 27" },
  { id: "19", company: "Notion",   role: "Full Stack",        ats: "Greenhouse",  status: "offer",     matchScore: 89, date: "May 7"  },
];

export const COLUMNS = [
  { id: "applied",   label: "Applied"   },
  { id: "oa",        label: "OA"        },
  { id: "interview", label: "Interview" },
  { id: "rejected",  label: "Rejected"  },
  { id: "offer",     label: "Offer"     },
];

export const STATUS_STYLE = {
  applied:   { bg: "#f0f0f4", color: "#6b7280"  },
  oa:        { bg: "#ede8ff", color: "#5b3df5"  },
  interview: { bg: "#e1f5ee", color: "#0f6e56"  },
  rejected:  { bg: "#fcebeb", color: "#e24b4a"  },
  offer:     { bg: "#e1f5ee", color: "#0f6e56"  },
};

export const ATS_STYLE = {
  Greenhouse:  { bg: "#ede8ff", color: "#5b3df5" },
  Workday:     { bg: "#f0f0f4", color: "#6b7280" },
  Lever:       { bg: "#e1f5ee", color: "#0f6e56" },
  Internshala: { bg: "#faeeda", color: "#854f0b" },
  Naukri:      { bg: "#fcebeb", color: "#e24b4a" },
};