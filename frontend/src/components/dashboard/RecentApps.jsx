const APPS = [
  { company: "Stripe",   role: "SWE II",           ats: "Greenhouse", status: "Interview", time: "2d ago", avatarBg: "#ede8ff", avatarColor: "#5b3df5"  },
  { company: "Razorpay", role: "Backend Engineer",  ats: "Lever",      status: "Interview", time: "3d ago", avatarBg: "#e1f5ee", avatarColor: "#0f6e56"  },
  { company: "Google",   role: "SWE III",           ats: "Workday",    status: "OA",        time: "4d ago", avatarBg: "#f0f0f4", avatarColor: "#6b7280"  },
  { company: "Meesho",   role: "Full Stack SDE",    ats: "Workday",    status: "Applied",   time: "5d ago", avatarBg: "#faeeda", avatarColor: "#854f0b"  },
  { company: "Zepto",    role: "Platform Eng",      ats: "Greenhouse", status: "Applied",   time: "6d ago", avatarBg: "#ede8ff", avatarColor: "#5b3df5"  },
  { company: "Juspay",   role: "SDE II",            ats: "Lever",      status: "Rejected",  time: "7d ago", avatarBg: "#e1f5ee", avatarColor: "#0f6e56"  },
  { company: "Flipkart", role: "SDE II",            ats: "Workday",    status: "Rejected",  time: "8d ago", avatarBg: "#fcebeb", avatarColor: "#e24b4a"  },
  { company: "Setu",     role: "Backend SDE",       ats: "Greenhouse", status: "Offer",     time: "9d ago", avatarBg: "#e1f5ee", avatarColor: "#0f6e56"  },
];

const STATUS_STYLE = {
  Applied:   { bg: "#f0f0f4", color: "#6b7280"  },
  OA:        { bg: "#ede8ff", color: "#5b3df5"  },
  Interview: { bg: "#e1f5ee", color: "#0f6e56"  },
  Rejected:  { bg: "#fcebeb", color: "#e24b4a"  },
  Offer:     { bg: "#e1f5ee", color: "#0f6e56"  },
};

const ATS_STYLE = {
  Greenhouse: { bg: "#ede8ff", color: "#5b3df5" },
  Workday:    { bg: "#f0f0f4", color: "#6b7280" },
  Lever:      { bg: "#e1f5ee", color: "#0f6e56" },
  Internshala:{ bg: "#faeeda", color: "#854f0b" },
  Naukri:     { bg: "#fcebeb", color: "#e24b4a" },
};

const Badge = ({ label, style }) => (
  <span
    className="rounded px-1.5 py-0.5"
    style={{
      fontSize: 9,
      fontFamily: "JetBrains Mono, monospace",
      background: style.bg,
      color: style.color,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

const RecentApps = ({ onViewAll }) => {
  return (
    <div
      className="bg-white rounded-2xl mb-4"
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
          Recent Applications
        </span>
        <button
          onClick={onViewAll}
          className="transition-opacity duration-100 hover:opacity-70"
          style={{
            fontSize: 11,
            fontFamily: "DM Sans, sans-serif",
            color: "#5b3df5",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          View all →
        </button>
      </div>
      {APPS.map((app, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 transition-colors duration-100 cursor-pointer"
          style={{
            height: 48,
            borderBottom: i < APPS.length - 1 ? "1px solid #f0f0f4" : "none",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f5f4ff"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{
              width: 32,
              height: 32,
              background: app.avatarBg,
              fontSize: 13,
              fontFamily: "Syne, sans-serif",
              fontWeight: 500,
              color: app.avatarColor,
            }}
          >
            {app.company[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="truncate"
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                color: "#0a0a0f",
              }}
            >
              {app.company}
            </div>
            <div
              className="truncate"
              style={{
                fontSize: 11,
                fontFamily: "DM Sans, sans-serif",
                color: "#6b7280",
              }}
            >
              {app.role}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge label={app.ats}    style={ATS_STYLE[app.ats] || ATS_STYLE.Workday} />
            <Badge label={app.status} style={STATUS_STYLE[app.status]} />
            <span
              style={{
                fontSize: 9,
                fontFamily: "JetBrains Mono, monospace",
                color: "#9ca3af",
                minWidth: 36,
                textAlign: "right",
              }}
            >
              {app.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentApps;