const FIELD_MAP = {
  // ── Name fields ──────────────────────────────────────────
  "first name":              "firstName",
  "given name":              "firstName",
  "legal first name":        "firstName",
  "preferred first name":    "firstName",
  "first":                   "firstName",
  "fname":                   "firstName",

  "last name":               "lastName",
  "surname":                 "lastName",
  "family name":             "lastName",
  "legal last name":         "lastName",
  "legal surname":           "lastName",
  "last":                    "lastName",
  "lname":                   "lastName",

  // ── Contact fields ────────────────────────────────────────
  "email":                   "email",
  "email address":           "email",
  "work email":              "email",
  "personal email":          "email",
  "e-mail":                  "email",
  "e-mail address":          "email",

  "phone":                   "phone",
  "phone number":            "phone",
  "mobile":                  "phone",
  "mobile number":           "phone",
  "mobile phone":            "phone",
  "mobile phone number":     "phone",
  "cell":                    "phone",
  "cell phone":              "phone",
  "telephone":               "phone",
  "contact number":          "phone",

  // ── Location fields ───────────────────────────────────────
  "location":                "location",
  "city":                    "location",
  "current location":        "location",
  "current city":            "location",
  "address":                 "location",
  "city, state":             "location",
  "city/state":              "location",

  // ── Online presence ───────────────────────────────────────
  "linkedin":                "linkedin",
  "linkedin url":            "linkedin",
  "linkedin profile":        "linkedin",
  "linkedin profile url":    "linkedin",
  "linkedin profile link":   "linkedin",

  "github":                  "github",
  "github url":              "github",
  "github profile":          "github",
  "github profile url":      "github",

  "portfolio":               "portfolio",
  "portfolio url":           "portfolio",
  "personal website":        "portfolio",
  "website":                 "portfolio",
  "personal site":           "portfolio",

  // ── Work preferences ──────────────────────────────────────
  "expected salary":         "expectedSalary",
  "expected ctc":            "expectedSalary",
  "desired salary":          "expectedSalary",
  "salary expectation":      "expectedSalary",
  "salary expectations":     "expectedSalary",
  "current ctc":             "expectedSalary",

  "notice period":           "noticePeriod",
  "notice":                  "noticePeriod",
  "joining period":          "noticePeriod",
  "availability":            "noticePeriod",
  "when can you join":       "noticePeriod",
  "earliest start date":     "noticePeriod",

  "work authorization":      "workAuth",
  "work auth":               "workAuth",
  "are you authorized":      "workAuth",
  "visa status":             "workAuth",
  "right to work":           "workAuth",

  // ── Cover letter ──────────────────────────────────────────
  "cover letter":            "coverLetter",
  "cover note":              "coverLetter",
  "why do you want to work": "coverLetter",
  "why this company":        "coverLetter",
  "why are you interested":  "coverLetter",
  "tell us about yourself":  "coverLetter",
};


export const classifyFromMap = (label) => {
  if (!label || typeof label !== "string") return null;

  const normalised = label.toLowerCase().trim().replace(/\s+/g, " ");

  return FIELD_MAP[normalised] || null;
};