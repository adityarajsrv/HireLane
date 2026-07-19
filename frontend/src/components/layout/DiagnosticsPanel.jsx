const CONFIDENCE_DATA = [
  { label: "field classify", value: 94, color: "#1bd29c" },
  { label: "jd+skills",      value: 87, color: "#1bd29c" },
  { label: "outcome pred",   value: 71, color: "#ef9f27" },
  { label: "cover letter",   value: 89, color: "#1bd29c" },
];

const CACHE_DATA = [
  { label: "L1 hits",      value: "1,204", color: "#1bd29c" },
  { label: "L2 redis",     value: "387",   color: "#1bd29c" },
  { label: "L3 embed",     value: "43",    color: "#ef9f27" },
  { label: "Gemini calls", value: "12",    color: "#9ca3af" },
  { label: "Hit rate",     value: "94.3%", color: "#1bd29c" },
];

const ACTIVITY = [
  { text: "Stripe SWE II filled — Greenhouse", time: "2m ago",  color: "#5b3df5" },
  { text: "Cover letter scored 9.1/10",        time: "3m ago",  color: "#1bd29c" },
  { text: "Razorpay → Interview stage",        time: "1h ago",  color: "#1bd29c" },
  { text: "Deadline: Zepto in 2 days",         time: "2h ago",  color: "#ef9f27" },
  { text: "Meesho PM role filled — Workday",   time: "3h ago",  color: "#5b3df5" },
  { text: "Flipkart SDE rejected",             time: "5h ago",  color: "#e24b4a" },
  { text: "Google SWE III → Final round",      time: "8h ago",  color: "#1bd29c" },
  { text: "Predictor retrained · +3%",         time: "12h ago", color: "#5b3df5" },
];

const SectionLabel = ({ children }) => (
  <div
    className="text-[#b0b0c0] uppercase tracking-widest mb-2"
    style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
  >
    {children}
  </div>
);

const DiagnosticsPanel = () => {
  return (
    <aside
      className="flex flex-col bg-white border-l border-[#f0f0f4] shrink-0 overflow-y-auto"
      style={{ width: 240 }}
    >
      <div className="p-3 border-b border-[#f0f0f4]">
        <SectionLabel>Model Confidence</SectionLabel>
        <div className="flex flex-col gap-2">
          {CONFIDENCE_DATA.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="text-[#9ca3af] shrink-0"
                style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", width: 80 }}
              >
                {item.label}
              </span>
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: 3, background: "#f0f0f4" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.value}%`, background: item.color }}
                />
              </div>
              <span
                className="text-[#9ca3af] text-right shrink-0"
                style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", width: 28 }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 border-b border-[#f0f0f4]">
        <SectionLabel>Cache Status</SectionLabel>
        <div className="flex flex-col gap-1">
          {CACHE_DATA.map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span
                className="text-[#9ca3af]"
                style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
              >
                {item.label}
              </span>
              <span
                style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: item.color }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 border-b border-[#f0f0f4]">
        <SectionLabel>Predictor Training</SectionLabel>

        <div className="flex justify-between items-center mb-1.5">
          <span
            className="text-[#9ca3af]"
            style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
          >
            data points
          </span>
          <span
            style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5" }}
          >
            312 / 500
          </span>
        </div>
        <div
          className="rounded-full overflow-hidden mb-1.5"
          style={{ height: 4, background: "#f0f0f4" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: "62%", background: "#5b3df5" }}
          />
        </div>
        <div style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#b0b0c0" }}>
          phase 1 · rule-based
        </div>
        <div style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#b0b0c0", marginTop: 2 }}>
          LR trains at 500pts
        </div>
      </div>
      <div className="p-3 flex-1">
        <SectionLabel>Activity</SectionLabel>
        <div className="flex flex-col">
          {ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 py-1.5 border-b border-[#f0f0f4] last:border-0">
              <span
                className="rounded-full shrink-0"
                style={{ width: 5, height: 5, background: item.color, marginTop: 4 }}
              />
              <div>
                <div
                  className="text-[#6b7280] leading-snug"
                  style={{ fontSize: 10, fontFamily: "DM Sans, sans-serif" }}
                >
                  {item.text}
                </div>
                <div
                  className="text-[#b0b0c0]"
                  style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", marginTop: 1 }}
                >
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DiagnosticsPanel;