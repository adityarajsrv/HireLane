import { useState } from "react";
import api from "../lib/axios.js";

const JDMatch = () => {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyse = async () => {
    if (!jd.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const profileRes = await api.get("/api/profile");
      const profile = profileRes.data.profile;

      if (!profile?.skills?.length) {
        setError(
          "Please upload your resume first so we can match your skills.",
        );
        return;
      }

      const jdLower = jd.toLowerCase();
      const userSkills = profile.skills || [];

      const matched = userSkills.filter((skill) =>
        jdLower.includes(skill.toLowerCase()),
      );

      const commonSkills = [
        "kafka",
        "grpc",
        "kubernetes",
        "k8s",
        "rust",
        "golang",
        "go",
        "terraform",
        "aws",
        "gcp",
        "azure",
        "spark",
        "flink",
        "redis",
        "postgresql",
        "elasticsearch",
        "graphql",
        "microservices",
      ];
      const missing = commonSkills.filter(
        (skill) =>
          jdLower.includes(skill) &&
          !userSkills.some((us) => us.toLowerCase() === skill),
      );

      const total = matched.length + missing.length;
      const matchScore =
        total > 0 ? Math.round((matched.length / total) * 100) : 65;
      let coverLetter = "";
      try {
        const coverRes = await api.post("/api/generate-cover", {
          jobDescription: jd,
          company: extractCompany(jd),
          role: extractRole(jd),
        });
        coverLetter = coverRes.data.coverLetter;
      } catch (coverErr) {
        console.warn("Cover letter generation failed:", coverErr.message);
      }

      const partial = userSkills
        .filter((skill) => {
          const sl = skill.toLowerCase();
          return (
            !matched.includes(skill) &&
            commonSkills.some((cs) => cs.includes(sl) || sl.includes(cs))
          );
        })
        .slice(0, 3);

      setResult({
        score: matchScore,
        interviewProbability: Math.round(matchScore * 0.85),
        matched: matched.slice(0, 8),
        missing: missing
          .slice(0, 5)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
        partial: partial.slice(0, 3),
        recommendation: coverLetter
          ? `Based on your profile: ${coverLetter.slice(0, 180)}...`
          : `Your ${matched[0] || "backend"} experience is your strongest match. Focus on highlighting distributed systems work.`,
      });

      api
        .post("/api/jdmatch", {
          company: extractCompany(jd),
          role: extractRole(jd),
          score: matchScore,
          matched: matched.slice(0, 8),
          missing: missing
            .slice(0, 5)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
        })
        .catch(() => {
        });
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          "AI quota exceeded. Match score calculated from profile — cover letter unavailable until tomorrow.",
        );
      } else if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message || "Analysis failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const extractCompany = (text) => {
    const lines = text.split("\n").filter(Boolean);
    return lines[0]?.split(" ").slice(0, 2).join(" ") || "the company";
  };

  const extractRole = (text) => {
    const roleKeywords = [
      "engineer",
      "developer",
      "manager",
      "designer",
      "analyst",
    ];
    const words = text.toLowerCase().split(/\s+/);
    const idx = words.findIndex((w) => roleKeywords.some((k) => w.includes(k)));
    if (idx > 0) {
      return words.slice(Math.max(0, idx - 1), idx + 2).join(" ");
    }
    return "Software Engineer";
  };

  return (
    <div>
      <div className="mb-5">
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: "#0a0a0f",
            marginBottom: 4,
          }}
        >
          JD Match
        </h1>
        <span
          style={{
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
            color: "#9ca3af",
          }}
        >
          Paste any job description · get instant match analysis
        </span>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <div
            className="bg-white rounded-2xl p-4 mb-3"
            style={{ border: "1px solid #f0f0f4" }}
          >
            <div
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
                marginBottom: 12,
              }}
            >
              Paste Job Description
            </div>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder={
                "Paste the full job description here...\n\nHireLane will extract required skills, match against your profile, and calculate interview probability."
              }
              className="w-full rounded-lg outline-none resize-none"
              style={{
                height: 340,
                border: "1px solid #e0e0ea",
                padding: 12,
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                color: "#374151",
                lineHeight: 1.6,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#5b3df5";
                e.target.style.boxShadow = "0 0 0 3px rgba(91,61,245,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0ea";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {error && (
            <div
              style={{
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
                color: "#e24b4a",
                marginBottom: 8,
                padding: "8px 12px",
                background: "#fcebeb",
                borderRadius: 8,
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyse}
            disabled={!jd.trim() || loading}
            className="w-full rounded-xl text-white flex items-center justify-center gap-2"
            style={{
              height: 40,
              background: "#5b3df5",
              border: "none",
              fontSize: 13,
              fontFamily: "Syne, sans-serif",
              fontWeight: 500,
              cursor: !jd.trim() || loading ? "not-allowed" : "pointer",
              opacity: !jd.trim() ? 0.5 : 1,
              marginBottom: 8,
            }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Analysing...
              </>
            ) : (
              "Analyse Match"
            )}
          </button>

          <div
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            ⚡ Uses 1 AI credit · matches against your uploaded resume
          </div>
        </div>

        <div>
          {!result && !loading && (
            <div
              className="bg-white rounded-2xl flex flex-col items-center justify-center"
              style={{ border: "1px solid #f0f0f4", minHeight: 420 }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e0e0ea"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: 12 }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "DM Sans, sans-serif",
                  color: "#9ca3af",
                  textAlign: "center",
                  maxWidth: 200,
                }}
              >
                Paste a job description to see your match score
              </span>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-3">
              <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>

              <div
                className="bg-white rounded-2xl p-5"
                style={{
                  border: "1px solid #f0f0f4",
                  animation: "fadeIn 300ms ease",
                }}
              >
                <div className="flex items-end gap-2 mb-2">
                  <span
                    style={{
                      fontSize: 40,
                      fontFamily: "JetBrains Mono, monospace",
                      fontWeight: 500,
                      color: "#5b3df5",
                      lineHeight: 1,
                    }}
                  >
                    {result.score}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#9ca3af",
                      marginBottom: 4,
                    }}
                  >
                    /100
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#6b7280",
                    marginBottom: 10,
                  }}
                >
                  Interview Probability: {result.interviewProbability}%
                </div>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ height: 4, background: "#f0f0f4" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${result.score}%`,
                      background: "linear-gradient(90deg, #5b3df5, #1bd29c)",
                      transition: "width 600ms ease",
                    }}
                  />
                </div>
              </div>

              {result.missing.length > 0 && (
                <div
                  className="bg-white rounded-2xl p-4"
                  style={{
                    border: "1px solid #f0f0f4",
                    animation: "fadeIn 300ms ease 50ms both",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#e24b4a",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                    }}
                  >
                    Missing — Act On These
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing.map((s) => (
                      <span
                        key={s}
                        className="rounded px-1.5 py-0.5"
                        style={{
                          fontSize: 9,
                          fontFamily: "JetBrains Mono, monospace",
                          background: "#fcebeb",
                          color: "#e24b4a",
                        }}
                      >
                        ✕ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.matched.length > 0 && (
                <div
                  className="bg-white rounded-2xl p-4"
                  style={{
                    border: "1px solid #f0f0f4",
                    animation: "fadeIn 300ms ease 100ms both",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#1bd29c",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                    }}
                  >
                    Matched
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched.map((s) => (
                      <span
                        key={s}
                        className="rounded px-1.5 py-0.5"
                        style={{
                          fontSize: 9,
                          fontFamily: "JetBrains Mono, monospace",
                          background: "#e1f5ee",
                          color: "#0f6e56",
                        }}
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="rounded-2xl p-4"
                style={{
                  background: "#f5f4ff",
                  border: "1px solid #ede8ff",
                  animation: "fadeIn 300ms ease 150ms both",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: "#5b3df5", fontSize: 12 }}>⚡</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#5b3df5",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    AI Recommendation
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    fontFamily: "DM Sans, sans-serif",
                    color: "#374151",
                    lineHeight: 1.6,
                  }}
                >
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JDMatch;
