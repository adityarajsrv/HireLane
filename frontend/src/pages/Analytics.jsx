import { useState } from "react";
import useAnalytics from "../hooks/useAnalytics.js";

const Analytics = () => {
  const [rangeDays, setRangeDays] = useState(30);
  const { data, loading } = useAnalytics(rangeDays);
  const rangeMap = { "7d": 7, "30d": 30, "90d": 90 };

  if (loading)
    return (
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11,
          color: "#9ca3af",
          padding: 24,
        }}
      >
        Loading analytics...
      </div>
    );

  const overview = data?.overview || {};
  const platforms = data?.platforms || [];
  const timeline = data?.timeline || [];
  const funnel = data?.funnel || {};
  const total = Object.values(funnel).reduce((a, b) => a + b, 0) || 1;

  const maxCount = Math.max(...timeline.map((t) => t.count), 1);
  const bestRate = Math.max(...platforms.map((p) => p.conversionRate), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 22,
              fontWeight: 500,
              color: "#0a0a0f",
              marginBottom: 4,
            }}
          >
            Analytics
          </h1>
          <span
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "#9ca3af",
            }}
          >
            Career intelligence · {data?.period} view
          </span>
        </div>
        <div
          className="flex p-0.5 rounded-xl"
          style={{ background: "#f0f0f4", border: "1px solid #e8e8f0" }}
        >
          {Object.entries(rangeMap).map(([label, days]) => (
            <button
              key={label}
              onClick={() => setRangeDays(days)}
              style={{
                height: 28,
                padding: "0 12px",
                borderRadius: 9,
                border: "none",
                fontSize: 12,
                fontFamily: "JetBrains Mono, monospace",
                cursor: "pointer",
                background: rangeDays === days ? "white" : "transparent",
                color: rangeDays === days ? "#0a0a0f" : "#9ca3af",
                boxShadow:
                  rangeDays === days ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div
        className="grid gap-4 mb-5"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {[
          { label: "Total Applications", value: overview.total || 0 },
          { label: "Response Rate", value: `${overview.responseRate || 0}%` },
          {
            label: "Est. Time Saved",
            value: `${overview.timeSavedHours || 0}h`,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4"
            style={{ border: "1px solid #f0f0f4" }}
          >
            <div
              style={{
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 22,
                fontFamily: "Syne, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr" }}>
        <div>
          <div
            className="bg-white rounded-2xl p-4 mb-4"
            style={{ border: "1px solid #f0f0f4" }}
          >
            <div
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
                marginBottom: 16,
              }}
            >
              Applications Over Time
            </div>
            {timeline.length === 0 ? (
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#b0b0c0",
                  padding: "40px 0",
                  textAlign: "center",
                }}
              >
                Not enough data yet — apply to a few roles to see your trend.
              </div>
            ) : (
              <div className="flex items-end gap-1" style={{ height: 140 }}>
                {timeline.map((t, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${(t.count / maxCount) * 120}px`,
                        background: "#5b3df5",
                        transition: `height 500ms ease ${i * 20}ms`,
                        minHeight: t.count > 0 ? 4 : 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 8,
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#b0b0c0",
                      }}
                    >
                      {new Date(t._id).toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className="bg-white rounded-2xl p-4"
            style={{ border: "1px solid #f0f0f4" }}
          >
            <div
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
                marginBottom: 16,
              }}
            >
              Platform Performance
            </div>
            {platforms.length === 0 ? (
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#b0b0c0",
                }}
              >
                No applications logged yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {platforms.map((p, i) => (
                  <div key={p.ats} className="flex items-center gap-3">
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#9ca3af",
                        width: 84,
                        flexShrink: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {p.ats}
                    </span>
                    <div
                      className="flex-1 rounded-full overflow-hidden"
                      style={{ height: 8, background: "#f0f0f4" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.conversionRate}%`,
                          background:
                            p.conversionRate === bestRate
                              ? "#1bd29c"
                              : "#5b3df5",
                          transition: `width 600ms ease ${i * 100}ms`,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#9ca3af",
                        width: 32,
                        textAlign: "right",
                      }}
                    >
                      {p.conversionRate}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div
            className="bg-white rounded-2xl p-4"
            style={{ border: "1px solid #f0f0f4" }}
          >
            <div
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
                marginBottom: 16,
              }}
            >
              Status Breakdown
            </div>
            <div className="flex flex-col gap-3">
              {Object.entries(funnel).map(([stage, count]) => {
                const pct = Math.round((count / total) * 100);
                const colors = {
                  applied: "#5b3df5",
                  oa: "#7f77dd",
                  interview: "#1bd29c",
                  offer: "#0f6e56",
                  rejected: "#e24b4a",
                };
                return (
                  <div key={stage} className="flex items-center gap-2">
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#9ca3af",
                        width: 60,
                        textAlign: "right",
                        flexShrink: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {stage}
                    </span>
                    <div
                      className="flex-1 rounded-sm overflow-hidden"
                      style={{ height: 14, background: "#f5f4ff" }}
                    >
                      <div
                        className="h-full rounded-sm flex items-center"
                        style={{
                          width: `${pct}%`,
                          background: colors[stage],
                          paddingLeft: 6,
                          minWidth: count > 0 ? 20 : 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 8,
                            fontFamily: "JetBrains Mono, monospace",
                            color: "white",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#9ca3af",
                        width: 28,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
