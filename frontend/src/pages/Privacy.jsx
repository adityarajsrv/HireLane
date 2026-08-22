import { Link } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 600, color: "#0a0a0f", marginBottom: 10 }}>
      {title}
    </h2>
    <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", color: "#4b5563", lineHeight: 1.7 }}>
      {children}
    </div>
  </div>
);

const Privacy = () => (
  <div className="min-h-screen" style={{ background: "#fafafa" }}>
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" style={{ fontSize: 13, color: "#5b3df5", textDecoration: "none" }}>← Back to home</Link>
      <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 700, color: "#0a0a0f", marginTop: 16, marginBottom: 8 }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", marginBottom: 32 }}>
        Last updated: August 2026
      </p>
      <Section title="What we collect">
        <p>
          HireLane collects the information you directly provide: your name, email, resume content,
          work history, education, and job applications you choose to track. When you use the browser
          extension, we also process the text of job application forms on pages you visit, solely to
          identify and fill relevant fields.
        </p>
      </Section>
      <Section title="How we use your data">
        <p>
          Your resume and profile data are used to auto-fill job applications, generate cover letters,
          and calculate JD match scores — all features you explicitly trigger. We do not sell your data,
          and we do not share it with third parties except the AI provider (Google Gemini) used to parse
          resumes and generate cover letter text, and our email provider used solely to send verification
          and password reset codes.
        </p>
      </Section>
      <Section title="Data storage">
        <p>
          Your data is stored in MongoDB Atlas. Passwords are hashed with bcrypt and never stored in
          plain text. Authentication uses httpOnly cookies that cannot be accessed by JavaScript,
          reducing exposure to cross-site scripting attacks.
        </p>
      </Section>
      <Section title="Browser extension permissions">
        <p>
          The HireLane extension only requests access to the specific job platforms it supports
          (Workday, Greenhouse, Internshala, Naukri, Wellfound). It does not track your browsing
          on any other site.
        </p>
      </Section>
      <Section title="Your rights">
        <p>
          You can delete your account and all associated data at any time from Settings. This
          permanently removes your profile, applications, and resume history from our database.
        </p>
      </Section>
      <Section title="Contact">
        <p>
          Questions about this policy? Reach out via the <Link to="/contact" style={{ color: "#5b3df5" }}>Contact page</Link>.
        </p>
      </Section>
    </div>
  </div>
);

export default Privacy;