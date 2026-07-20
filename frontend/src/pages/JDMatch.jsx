import { useState } from "react";

const MOCK_RESULT = {
  score: 73,
  interviewProbability: 62,
  missing:  ["Kafka", "gRPC", "K8s ops"],
  partial:  ["Rust (basic)", "System Design"],
  matched:  ["Node.js", "React", "MongoDB", "REST APIs", "Docker"],
  recommendation: "Lead with your MongoDB at-scale experience. Mention Kafka as a learning goal, not a gap. The JD emphasises distributed systems — your microservices migration bullet is your strongest lead.",
};

const JDMatch = () => {
  const [jd,       setJd      ] = useState("");
  const [loading,  setLoading ] = useState(false);
  const [result,   setResult  ] = useState(null);

  const handleAnalyse = () => {
    if (!jd.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult(MOCK_RESULT);
    }, 1800);
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
              className="mb-3"
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
              }}
            >
              Paste Job Description
            </div>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder={"Paste the full job description here...\n\nHireLane will extract required skills, match against your profile, and calculate interview probability."}
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
                e.target.style.boxShadow   = "0 0 0 3px rgba(91,61,245,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0ea";
                e.target.style.boxShadow   = "none";
              }}
            />
          </div>
          <button
            onClick={handleAnalyse}
            disabled={!jd.trim() || loading}
            className="w-full rounded-xl text-white flex items-center justify-center gap-2 transition-opacity"
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
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Analysing with Gemini...
              </>
            ) : (
              "Analyse Match"
            )}
          </button>
          <div
            className="text-center"
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#9ca3af",
            }}
          >
            ⚡ Uses 1 AI credit · 4 remaining today
          </div>
        </div>
        <div>
          {!result && !loading && (
            // Empty state
            <div
              className="bg-white rounded-2xl flex flex-col items-center justify-center"
              style={{
                border: "1px solid #f0f0f4",
                height: "100%",
                minHeight: 420,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e0e0ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
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
              <div
                className="bg-white rounded-2xl p-5"
                style={{
                  border: "1px solid #f0f0f4",
                  animation: "fadeIn 300ms ease",
                }}
              >
                <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
                <div className="flex items-end gap-2 mb-1">
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
              <div
                className="bg-white rounded-2xl p-4"
                style={{ border: "1px solid #f0f0f4", animation: "fadeIn 300ms ease 50ms both" }}
              >
                <div
                  className="mb-2 uppercase tracking-widest"
                  style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#e24b4a" }}
                >
                  Missing — Act On These
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing.map((s) => (
                    <span
                      key={s}
                      className="rounded px-1.5 py-0.5 flex items-center gap-1"
                      style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: "#fcebeb", color: "#e24b4a" }}
                    >
                      ✕ {s}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="bg-white rounded-2xl p-4"
                style={{ border: "1px solid #f0f0f4", animation: "fadeIn 300ms ease 100ms both" }}
              >
                <div
                  className="mb-2 uppercase tracking-widest"
                  style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#1bd29c" }}
                >
                  Matched
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.matched.map((s) => (
                    <span
                      key={s}
                      className="rounded px-1.5 py-0.5 flex items-center gap-1"
                      style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: "#e1f5ee", color: "#0f6e56" }}
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="bg-white rounded-2xl p-4"
                style={{ border: "1px solid #f0f0f4", animation: "fadeIn 300ms ease 150ms both" }}
              >
                <div
                  className="mb-2 uppercase tracking-widest"
                  style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#ef9f27" }}
                >
                  Partial
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.partial.map((s) => (
                    <span
                      key={s}
                      className="rounded px-1.5 py-0.5 flex items-center gap-1"
                      style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: "#faeeda", color: "#854f0b" }}
                    >
                      ~ {s}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "#f5f4ff",
                  border: "1px solid #ede8ff",
                  animation: "fadeIn 300ms ease 200ms both",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: "#5b3df5", fontSize: 12 }}>⚡</span>
                  <span
                    className="uppercase tracking-widest"
                    style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5" }}
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