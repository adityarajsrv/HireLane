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
  "firstName": "",
  "lastName": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "skills": [],
  "cvBullets": [],
  "targetRoles": []
}

Rules:
- cvBullets: extract 6-10 strong achievement bullets from experience section
- skills: extract all technical skills mentioned
- targetRoles: infer 2-3 job titles this person is targeting
- If a field is not found, return empty string or empty array
- Return ONLY the JSON, nothing else

Resume text:
${resumeText}
    `,
  });

  const text = interaction.text.trim();

  const clean = text
    .replace(/^```json\n?/, "")
    .replace(/^```\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  return JSON.parse(clean);
};

const generateCoverLetter = async ({ jobDescription, cvBullets, targetRole, company }) => {
  const interaction = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",   
    contents: `
Write a concise, tailored cover letter opening (3 paragraphs max) for this job application.

Company: ${company}
Role: ${targetRole}

Candidate's key achievements:
${cvBullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Job Description:
${jobDescription.slice(0, 2000)}

Rules:
- Do NOT use generic phrases like "I am writing to express my interest"
- Lead with the strongest matching achievement
- Reference specific requirements from the job description
- Sound like a senior engineer wrote it, not a template
- Maximum 200 words
- No subject line, no salutation, no sign-off — just the body paragraphs
    `,
  });

  return interaction.text.trim();
};

export { parseResume, generateCoverLetter };