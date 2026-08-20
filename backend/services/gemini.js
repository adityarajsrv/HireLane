import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const parseResume = async (resumeText) => {
  const interaction = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: `
You are a resume parser. Extract structured data from this resume text.

Return ONLY a valid JSON object with exactly these fields, no markdown, no explanation:
{
  "firstName": "", "lastName": "", "phone": "", "location": "",
  "linkedin": "", "github": "", "portfolio": "",
  "skills": [], "cvBullets": [], "targetRoles": [], certifications: [],
  "workExperience": [
    { "company": "", "title": "", "startDate": "", "endDate": "", "description": "" }
  ],
  "education": [
    { "school": "", "degree": "", "fieldOfStudy": "", "graduationYear": "", "gpa": "" }
  ]
}

Rules:
- workExperience: extract each distinct job/internship as a separate object,
  most recent first. startDate/endDate in "YYYY-MM" format if determinable,
  else best guess. endDate empty string if currently employed there.
- education: extract each degree separately, most recent first.
- cvBullets: extract 6-10 strong achievement bullets from experience section
- skills: extract all technical skills mentioned
- targetRoles: infer 2-3 job titles this person is targeting
- Return ONLY the JSON, nothing else

Resume text:
${resumeText}
    `,
  });

  const text = interaction.text.trim();
  const clean = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean);
};

const COVER_LETTER_STYLES = {
  formal: {
    label: "Formal Cover Letter",
    instruction: `
Write in a traditional, professional cover letter tone. Structured,
respectful, slightly conservative in phrasing. Suitable for
enterprise companies, finance, government-adjacent, or traditional
corporate roles. No casual language, no jokes, no startup slang.
    `,
  },
  pitch: {
    label: "Startup Pitch",
    instruction: `
Write like a founder-to-founder pitch, not a formal letter. Direct,
confident, energetic. Lead with your strongest concrete achievement
immediately — no throat-clearing. Short punchy sentences. This is
for early-stage startups (Wellfound-style) where a stiff formal
letter would feel out of place and read as a mismatch with the
company's own culture.
    `,
  },
  technical: {
    label: "Technical Deep-Dive",
    instruction: `
Write with heavy emphasis on specific technical decisions, tradeoffs,
and measurable outcomes (latency numbers, scale figures, architecture
choices). Assume the reader is a technical hiring manager or
engineering lead who will skim for concrete signal, not soft skills
language. Minimal fluff, maximum specificity.
    `,
  },
  concise: {
    label: "Concise & Direct",
    instruction: `
Maximum 100 words total. One paragraph. State your single strongest
match to the role, one number/outcome to back it up, and a direct
statement of interest. No preamble, no closing pleasantries beyond
one line.
    `,
  },
};

const generateCoverLetter = async ({ jobDescription, cvBullets, targetRole, company, style = "formal" }) => {
  const styleConfig = COVER_LETTER_STYLES[style] || COVER_LETTER_STYLES.formal;

  const interaction = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: `
Write a tailored cover letter opening for this job application.

STYLE: ${styleConfig.label}
${styleConfig.instruction}

Company: ${company}
Role: ${targetRole}

Candidate's key achievements:
${cvBullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Job Description:
${jobDescription.slice(0, 2000)}

Universal rules regardless of style:
- Never use "I am writing to express my interest" or equivalent
  generic openers
- Lead with the single strongest matching achievement, always
  something concrete and specific from the candidate's bullets above,
  never a vague personality claim
- Reference at least one specific requirement or detail from the
  job description directly — proves this wasn't copy-pasted
- No subject line, no salutation ("Dear Hiring Manager"), no sign-off
  — just the body content itself
- Maximum 200 words unless the style explicitly says otherwise
    `,
  });

  return interaction.text.trim();
};

const classifyField = async (label, ats) => {
  const interaction = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: `
You are classifying a job application form field.

ATS Platform: ${ats}
Field Label: "${label}"

Which profile key does this field map to?
Return ONLY one of these exact strings, nothing else:
firstName, lastName, email, phone, linkedin, github, 
portfolio, location, workAuth, expectedSalary, 
noticePeriod, coverLetter, unknown

If the field doesn't match any of the above clearly, return: unknown

Return only the single word, no explanation, no punctuation.
    `,
  })

  const result = interaction.text.trim().toLowerCase();

  const validKeys = [
    "firstName", "lastName", "email", "phone",
    "linkedin", "github", "portfolio", "location",
    "workAuth", "expectedSalary", "noticePeriod",
    "coverLetter", "unknown",
  ];

  const matched = validKeys.find(key => key.toLowerCase() === result);

  return matched || "unknown";
}

export { parseResume, generateCoverLetter, classifyField };