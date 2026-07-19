const REMINDERS = [
  { label: "Zepto — Platform Eng interview", date: "Jul 13", urgent: true,  daysLeft: "2d"  },
  { label: "CRED — OA due",                  date: "Jul 14", urgent: true,  daysLeft: "3d"  },
  { label: "Razorpay — System design round", date: "Jul 17", urgent: false, daysLeft: "6d"  },
  { label: "Stripe — Onsite loop",           date: "Jul 21", urgent: false, daysLeft: "10d" },
];

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>
);

const UpcomingCard = () => {
  return (
    <div
      className="bg-white rounded-2xl mt-4"
      style={{ border: "1px solid #f0f0f4" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #f0f0f4" }}
      >
        <span
          style={{
            fontSize: 13,
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 500,
            color: "#0a0a0f",
          }}
        >
          Upcoming
        </span>
        <span
          style={{
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            color: "#9ca3af",
          }}
        >
          {REMINDERS.length} items
        </span>
      </div>
      {REMINDERS.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4"
          style={{
            height: 40,
            borderBottom: i < REMINDERS.length - 1 ? "1px solid #f0f0f4" : "none",
          }}
        >
          <span style={{ color: r.urgent ? "#ef9f27" : "#9ca3af" }}>
            <CalendarIcon />
          </span>
          <span
            className="flex-1 truncate"
            style={{
              fontSize: 12,
              fontFamily: "DM Sans, sans-serif",
              color: "#374151",
            }}
          >
            {r.label}
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: r.urgent ? "#ef9f27" : "#9ca3af",
            }}
          >
            {r.date}
          </span>
          <span
            className="rounded px-1"
            style={{
              fontSize: 9,
              fontFamily: "JetBrains Mono, monospace",
              background: r.urgent ? "#faeeda" : "#f0f0f4",
              color: r.urgent ? "#ef9f27" : "#9ca3af",
              padding: "1px 5px",
            }}
          >
            {r.daysLeft}
          </span>
        </div>
      ))}
    </div>
  );
};

export default UpcomingCard;