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

const Terms = () => (
  <div className="min-h-screen" style={{ background: "#fafafa" }}>
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" style={{ fontSize: 13, color: "#5b3df5", textDecoration: "none" }}>← Back to home</Link>
      <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 700, color: "#0a0a0f", marginTop: 16, marginBottom: 8 }}>
        Terms of Service
      </h1>
      <p style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", marginBottom: 32 }}>
        Last updated: August 2026
      </p>
      <Section title="Using HireLane">
        <p>
          HireLane is a tool to help you track and streamline job applications. It is provided as-is,
          currently free to use, with usage limits (application tracking, AI calls per day, autofills
          per month) shown in your account Settings.
        </p>
      </Section>
      <Section title="Your responsibility">
        <p>
          You are responsible for the accuracy of the information in your profile and any application
          submitted using HireLane. The extension fills forms based on your provided data — always
          review a filled application before submitting it. HireLane is not responsible for errors
          in submitted applications.
        </p>
      </Section>
      <Section title="AI-generated content">
        <p>
          Cover letters and match scores are generated using AI (Google Gemini) and provided as
          drafts to assist you, not as final, guaranteed-accurate content. Review all AI-generated
          text before using it.
        </p>
      </Section>
      <Section title="Fair use">
        <p>
          The browser extension is intended for your own personal job search. Automated bulk
          application submission beyond normal individual use, or use that violates a job platform's
          own terms of service, is not supported or endorsed.
        </p>
      </Section>
      <Section title="Changes to service">
        <p>
          HireLane is an actively developed, independent project. Features, limits, and this policy
          may change as the product evolves. We'll do our best to communicate meaningful changes.
        </p>
      </Section>
      <Section title="Contact">
        <p>
          Questions? Reach out via the <Link to="/contact" style={{ color: "#5b3df5" }}>Contact page</Link>.
        </p>
      </Section>
    </div>
  </div>
);

export default Terms;