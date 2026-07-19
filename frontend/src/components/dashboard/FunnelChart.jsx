import { useEffect, useState } from "react";

const FUNNEL = [
  { stage: "Applied",   count: 34, pct: 100, color: "#5b3df5"              },
  { stage: "OA",        count: 13, pct: 38,  color: "#7f77dd", conv: "38%" },
  { stage: "Interview", count: 6,  pct: 18,  color: "#1bd29c", conv: "18%" },
  { stage: "Final",     count: 3,  pct: 9,   color: "#0d9e7a", conv: "9%"  },
  { stage: "Offer",     count: 2,  pct: 6,   color: "#0f6e56", conv: "6%"  },
];

const FunnelChart = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
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
        Conversion Funnel
      </div>
      <div className="flex flex-col gap-2">
        {FUNNEL.map((item, i) => (
          <div key={item.stage}>
            <div className="flex items-center gap-2">
              <span
                className="shrink-0 text-right"
                style={{
                  fontSize: 9,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#9ca3af",
                  width: 52,
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
                    width: animated ? `${item.pct}%` : "0%",
                    background: item.color,
                    transition: `width 700ms ease ${i * 100}ms`,
                    paddingLeft: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "white",
                      fontWeight: 500,
                    }}
                  >
                    {item.count}
                  </span>
                </div>
              </div>
              <span
                className="shrink-0 text-right"
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
            {item.conv && (
              <div
                style={{
                  fontSize: 8,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#b0b0c0",
                  paddingLeft: 60,
                  marginTop: 1,
                  marginBottom: 1,
                }}
              >
                → {item.conv} moved forward
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelChart;