import { useState, useEffect } from "react";
import api from "../lib/axios.js";

const Insights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/jdmatch/insights")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9ca3af", padding: 24 }}>Loading insights...</div>
  );

  if (!data || data.totalAnalyzed === 0) {
    return (
      <div>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>Insights</h1>
        <div className="bg-white rounded-2xl p-8 text-center" style={{ border: "1px solid #f0f0f4" }}>
          <p style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#9ca3af" }}>
            Run a few JD Match analyses to unlock real skill-gap trends here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>Insights</h1>
        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>
          Based on {data.totalAnalyzed} JD analyses
        </span>
      </div>

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase" }}>Avg Match Score</div>
          <div style={{ fontSize: 28, fontFamily: "Syne, sans-serif", fontWeight: 500, color: "#5b3df5" }}>{data.avgScore}%</div>
        </div>
        <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase" }}>JDs Analyzed</div>
          <div style={{ fontSize: 28, fontFamily: "Syne, sans-serif", fontWeight: 500, color: "#0a0a0f" }}>{data.totalAnalyzed}</div>
        </div>
        <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase" }}>
            Cover Letters Drafted
          </div>
          <div style={{ fontSize: 28, fontFamily: "Syne, sans-serif", fontWeight: 500, color: "#5b3df5" }}>
            {data.coverLettersGenerated ?? 0}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-4" style={{ border: "1px solid #f0f0f4" }}>
        <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, marginBottom: 12 }}>Most Recurring Skill Gaps</div>
        {data.topMissingSkills.map((s) => (
          <div key={s.skill} className="flex items-center gap-3 mb-2">
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#374151", width: 100 }}>{s.skill}</span>
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: "#f0f0f4" }}>
              <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: "#e24b4a" }} />
            </div>
            <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>{s.count}x</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #f0f0f4" }}>
        <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, marginBottom: 12 }}>Recent Analyses</div>
        {data.recent.map((r, i) => (
          <div key={i} className="flex justify-between py-2" style={{ borderBottom: "1px solid #f0f0f4" }}>
            <span style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#374151" }}>{r.company || "—"} · {r.role || "—"}</span>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5" }}>{r.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;