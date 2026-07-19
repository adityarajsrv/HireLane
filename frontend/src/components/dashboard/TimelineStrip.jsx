import { useEffect, useState } from "react";

const generateMockTimeline = () => {
  const days = [];
  for (let i = 0; i < 30; i++) {
    const rand = Math.random();
    const count = Math.floor(Math.random() * 5);
    days.push({
      count,
      type: rand > 0.7 ? "ai" : rand > 0.5 ? "move" : "normal",
      isToday: i === 29,
    });
  }
  return days;
};

const TIMELINE = generateMockTimeline();

const barColor = (day) => {
  if (day.isToday) return "#5b3df5";
  if (day.type === "ai")   return "rgba(91,61,245,0.5)";
  if (day.type === "move") return "rgba(27,210,156,0.6)";
  return "#e8e8f0";
};

const TimelineStrip = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const maxCount = Math.max(...TIMELINE.map((d) => d.count), 1);

  return (
    <div
      className="bg-white rounded-2xl p-3 mb-4"
      style={{ border: "1px solid #f0f0f4" }}
    >
      {/* Bars */}
      <div
        className="flex items-end gap-0.5"
        style={{ height: 36 }}
      >
        {TIMELINE.map((day, i) => {
          const targetHeight = day.count === 0
            ? 4   
            : Math.max(4, (day.count / maxCount) * 32);

          return (
            <div
              key={i}
              className="rounded-t-sm flex-1"
              style={{
                height: animated ? targetHeight : 0,
                minWidth: 6,
                background: barColor(day),
                transition: `height 400ms ease ${i * 12}ms`,
                animation: day.isToday
                  ? "breathe 1.5s ease-in-out infinite"
                  : "none",
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-4 mt-2">
        {[
          { color: "rgba(91,61,245,0.5)",  label: "AI Fill" },
          { color: "rgba(27,210,156,0.6)", label: "Movement" },
          { color: "#e8e8f0",              label: "Applied" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="rounded-full"
              style={{ width: 6, height: 6, background: color, flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: 9,
                fontFamily: "JetBrains Mono, monospace",
                color: "#9ca3af",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default TimelineStrip;