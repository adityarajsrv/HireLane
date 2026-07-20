import { useState } from "react";

const DATE_RANGES = ["7d", "30d", "90d", "All"];

const TIMELINE_DATA = [
  { label: "Wk 1", count: 4  },
  { label: "Wk 2", count: 7  },
  { label: "Wk 3", count: 7  },
  { label: "Wk 4", count: 6  },
  { label: "Wk 5", count: 11 },
  { label: "Wk 6", count: 8  },
  { label: "Wk 7", count: 9  },
];

const PLATFORM_DATA = [
  { name: "Greenhouse",  rate: 42, best: true  },
  { name: "Lever",       rate: 38, best: false },
  { name: "Workday",     rate: 14, best: false },
  { name: "Internshala", rate: 19, best: false },
  { name: "Naukri",      rate: 11, best: false },
];

const FUNNEL = [
  { stage: "Applied",   count: 34, pct: 100, color: "#5b3df5"  },
  { stage: "OA",        count: 13, pct: 38,  color: "#7f77dd"  },
  { stage: "Interview", count: 6,  pct: 18,  color: "#1bd29c"  },
  { stage: "Final",     count: 3,  pct: 9,   color: "#0d9e7a"  },
  { stage: "Offer",     count: 2,  pct: 6,   color: "#0f6e56"  },
];

const MATCHED_SKILLS  = ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Docker", "REST APIs", "Git", "PostgreSQL", "Redis"];
const MISSING_SKILLS  = ["Kafka", "gRPC", "K8s ops", "Rust", "FinTech domain", "System Design at scale"];

const LineChart = ({ data }) => {
  const W = 500, H = 160, PAD = { top: 20, right: 20, bottom: 30, left: 30 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => d.count));

  const x = (i) => PAD.left + (i / (data.length - 1)) * chartW;
  const y = (v) => PAD.top  + chartH - (v / maxVal) * chartH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.count)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${x(data.length - 1)} ${PAD.top + chartH}` +
    ` L ${x(0)} ${PAD.top + chartH} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {[0, Math.round(maxVal / 2), maxVal].map((v) => (
        <text
          key={v}
          x={PAD.left - 6}
          y={y(v) + 4}
          textAnchor="end"
          style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", fill: "#9ca3af" }}
        >
          {v}
        </text>
      ))}
      {data.map((d, i) => (
        <text
          key={i}
          x={x(i)}
          y={H - 4}
          textAnchor="middle"
          style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", fill: "#9ca3af" }}
        >
          {d.label}
        </text>
      ))}
      <path d={areaPath} fill="rgba(91,61,245,0.06)" />
      <path
        d={linePath}
        fill="none"
        stroke="#5b3df5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: 0,
          animation: "drawLine 800ms ease forwards",
        }}
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(d.count)}
          r="3"
          fill="#5b3df5"
          style={{ opacity: 0.8 }}
        />
      ))}
      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
};

const Analytics = () => {
  const [range, setRange] = useState("30d");

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
            Career intelligence · updated 2m ago
          </span>
        </div>
        <div
          className="flex p-0.5 rounded-xl"
          style={{ background: "#f0f0f4", border: "1px solid #e8e8f0" }}
        >
          {DATE_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                height: 28,
                padding: "0 12px",
                borderRadius: 9,
                border: "none",
                fontSize: 12,
                fontFamily: "JetBrains Mono, monospace",
                cursor: "pointer",
                background: range === r ? "white" : "transparent",
                color:      range === r ? "#0a0a0f" : "#9ca3af",
                boxShadow:  range === r ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                transition: "all 150ms",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div
        className="grid gap-4 mb-5"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {[
          { label: "Response Rate",       value: "17.6%", delta: "+2.1% from last period", positive: true  },
          { label: "Interview Conversion", value: "46.2%", delta: "+5.4% from last period", positive: true  },
          { label: "Avg Time to Response", value: "4.3d",  delta: "-0.8d from last period",  positive: false },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4"
            style={{ border: "1px solid #f0f0f4" }}
          >
            <div
              className="mb-1 uppercase tracking-widest"
              style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 22,
                fontFamily: "Syne, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
                marginBottom: 4,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
                color: stat.positive ? "#1bd29c" : "#e24b4a",
              }}
            >
              {stat.positive ? "↑" : "↓"} {stat.delta}
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
              className="mb-4"
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
              }}
            >
              Applications Over Time
            </div>
            <LineChart data={TIMELINE_DATA} />
          </div>
          <div
            className="bg-white rounded-2xl p-4"
            style={{ border: "1px solid #f0f0f4", position: "relative" }}
          >
            <div
              className="mb-4"
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
              }}
            >
              Platform Performance
            </div>
            <div className="flex flex-col gap-3">
              {PLATFORM_DATA.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#9ca3af",
                      width: 84,
                      flexShrink: 0,
                    }}
                  >
                    {p.name}
                  </span>
                  <div
                    className="flex-1 rounded-full overflow-hidden"
                    style={{ height: 8, background: "#f0f0f4" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.rate}%`,
                        background: p.best ? "#1bd29c" : "#5b3df5",
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
                    {p.rate}%
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))",
                borderRadius: "0 0 16px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 16,
              }}
            >
              <div
                className="text-center"
                style={{
                  background: "white",
                  border: "1px solid #f0f0f4",
                  borderRadius: 12,
                  padding: "12px 20px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 500,
                    color: "#0a0a0f",
                    marginBottom: 4,
                  }}
                >
                  Unlock Full Analytics
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "DM Sans, sans-serif",
                    color: "#6b7280",
                    marginBottom: 10,
                  }}
                >
                  See all platform data, skill trends, and conversion breakdowns
                </div>
                <button
                  style={{
                    background: "#5b3df5",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 20px",
                    fontSize: 12,
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 500,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className="bg-white rounded-2xl p-4 mb-4"
            style={{ border: "1px solid #f0f0f4" }}
          >
            <div
              className="mb-4"
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
              }}
            >
              Conversion Funnel
            </div>
            <div className="flex flex-col gap-3">
              {FUNNEL.map((item) => (
                <div key={item.stage} className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#9ca3af",
                      width: 52,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {item.stage}
                  </span>
                  <div
                    className="flex-1 rounded-sm overflow-hidden"
                    style={{ height: 14, background: "#f5f4ff" }}
                  >
                    <div
                      className="h-full rounded-sm flex items-center"
                      style={{
                        width: `${item.pct}%`,
                        background: item.color,
                        paddingLeft: 6,
                      }}
                    >
                      <span style={{ fontSize: 8, fontFamily: "JetBrains Mono, monospace", color: "white" }}>
                        {item.count}
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
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="bg-white rounded-2xl p-4"
            style={{ border: "1px solid #f0f0f4" }}
          >
            <div
              className="mb-4"
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
              }}
            >
              Skill Gap
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <div
                  className="mb-2"
                  style={{
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#1bd29c",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  In your profile
                </div>
                <div className="flex flex-wrap gap-1">
                  {MATCHED_SKILLS.map((s) => (
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
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div
                  className="mb-2"
                  style={{
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#e24b4a",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Missing from JDs
                </div>
                <div className="flex flex-wrap gap-1">
                  {MISSING_SKILLS.map((s) => (
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
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="mt-4 pt-3"
              style={{ borderTop: "1px solid #f0f0f4" }}
            >
              <button
                style={{
                  fontSize: 11,
                  fontFamily: "DM Sans, sans-serif",
                  color: "#5b3df5",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Update Profile →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;