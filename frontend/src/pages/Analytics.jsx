import { useState } from "react";
import useAnalytics from "../hooks/useAnalytics.js";

const Analytics = () => {
  const [rangeDays, setRangeDays] = useState(30);
  const { data, loading, error  } = useAnalytics(rangeDays);

  const rangeMap = { "7d": 7, "30d": 30, "90d": 90, "All": 365 };

  if (loading) return (
    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9ca3af", padding: 24 }}>
      Loading analytics...
    </div>
  );

  // Map backend data to component format
  const overview  = data?.overview  || {};
  const platforms = data?.platforms || [];
  const timeline  = data?.timeline  || [];
  const funnel    = data?.funnel    || {};

  // Convert timeline [{_id: "2025-07-01", count: 3}] to chart format
  const timelineChart = timeline.map((t) => ({
    label: new Date(t._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: t.count,
  }));

  // Rest of the JSX is identical to your current Analytics.jsx
  // Just replace TIMELINE_DATA with timelineChart
  // Replace PLATFORM_DATA with platforms (field names: name→ats, rate→conversionRate)
  // Replace FUNNEL with funnel object
  // Replace headline stat hardcoded values with overview.responseRate etc.

  return (
    <div>
      {/* Header with real date range switching */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
            Analytics
          </h1>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>
            Career intelligence · {data?.period} view
          </span>
        </div>
        <div className="flex p-0.5 rounded-xl" style={{ background: "#f0f0f4", border: "1px solid #e8e8f0" }}>
          {Object.entries(rangeMap).map(([label, days]) => (
            <button key={label} onClick={() => setRangeDays(days)}
              style={{
                height: 28, padding: "0 12px", borderRadius: 9, border: "none",
                fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer",
                background: rangeDays === days ? "white" : "transparent",
                color:      rangeDays === days ? "#0a0a0f" : "#9ca3af",
                boxShadow:  rangeDays === days ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                transition: "all 150ms",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Headline stats — real data */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          { label: "Response Rate",        value: `${overview.responseRate || 0}%`,       positive: true  },
          { label: "Interview Conversion",  value: `${overview.interviewRate || "—"}`,     positive: true  },
          { label: "Avg Time to Response",  value: `${overview.avgDaysToResponse || "—"}`, positive: false },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4" style={{ border: "1px solid #f0f0f4" }}>
            <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 22, fontFamily: "Syne, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Keep the rest of the JSX exactly the same as your existing Analytics.jsx */}
      {/* Just swap the data sources as shown above */}
    </div>
  );
};

export default Analytics;