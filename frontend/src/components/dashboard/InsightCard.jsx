const InsightCard = () => {
  return (
    <div
      className="bg-white rounded-2xl p-4 mt-4"
      style={{ border: "1px solid #f0f0f4" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="rounded-full animate-pulse shrink-0"
          style={{ width: 5, height: 5, background: "#5b3df5", display: "block" }}
        />
        <span
          className="uppercase tracking-widest text-[#9ca3af]"
          style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
        >
          Model Insight
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          fontFamily: "DM Sans, sans-serif",
          color: "#374151",
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        Greenhouse is converting{" "}
        <strong style={{ color: "#0f6e56" }}>2.8×</strong>{" "}
        better than Workday for your profile this week.
        Prioritise Lever and Greenhouse roles next.
      </p>
      <div className="flex gap-2 flex-wrap">
        <span
          className="rounded px-1.5 py-0.5"
          style={{
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            background: "#e1f5ee",
            color: "#0f6e56",
          }}
        >
          ✓ Node.js
        </span>
        {["Kafka", "gRPC"].map((skill) => (
          <span
            key={skill}
            className="rounded px-1.5 py-0.5"
            style={{
              fontSize: 9,
              fontFamily: "JetBrains Mono, monospace",
              background: "#fcebeb",
              color: "#e24b4a",
            }}
          >
            ✕ {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default InsightCard;