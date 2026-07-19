/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

const CARDS = [
  {
    label: "applications sent",
    value: 34,
    display: "34",
    delta: "+8 from last week",
    deltaPositive: true,
  },
  {
    label: "response rate",
    value: 17.6,
    display: "17.6%",
    delta: "+2.1% from last week",
    deltaPositive: true,
  },
  {
    label: "time saved",
    value: 4.5,
    display: "4.5h",
    delta: "+1.2h from last week",
    deltaPositive: true,
    valueColor: "#1bd29c",
  },
  {
    label: "ai fills this month",
    value: 11,
    display: "11/15",
    delta: "4 remaining",
    deltaPositive: null, 
    valueColor: "#ef9f27",
    warn: true, 
  },
];

const CountUp = ({ target, suffix = "", color }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration  = 800;
    const steps     = 40;
    const increment = target / steps;
    const interval  = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCurrent(Math.min(target, Math.round(increment * step * 10) / 10));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span style={{ color: color || "#0a0a0f" }}>
      {current}{suffix}
    </span>
  );
};

const StatCards = () => {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 16 }}
    >
      {CARDS.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl p-4 transition-all duration-150"
          style={{
            border: card.warn
              ? "1px solid #fde68a"   
              : "1px solid #f0f0f4",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = card.warn ? "#f59e0b" : "#e0e0ea";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = card.warn ? "#fde68a" : "#f0f0f4";
          }}
        >
          <div
            className="mb-2 uppercase tracking-widest text-[#9ca3af]"
            style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
          >
            {card.label}
          </div>
          <div
            className="mb-1"
            style={{
              fontSize: 28,
              fontFamily: "Syne, sans-serif",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {card.warn ? (
              <span style={{ color: card.valueColor || "#0a0a0f" }}>
                {card.display}
              </span>
            ) : (
              <span style={{ color: card.valueColor || "#0a0a0f" }}>
                {card.display}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: card.deltaPositive === true
                ? "#1bd29c"
                : card.deltaPositive === false
                ? "#e24b4a"
                : "#9ca3af",
            }}
          >
            {card.deltaPositive === true  && "↑ "}
            {card.deltaPositive === false && "↓ "}
            {card.delta}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;