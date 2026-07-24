import { useState, useEffect } from "react";
import useAnalytics    from "../hooks/useAnalytics.js";
import useApplications from "../hooks/useApplications.js";
import TimelineStrip   from "../components/dashboard/TimelineStrip.jsx";
import InsightCard     from "../components/dashboard/InsightCard.jsx";
import UpcomingCard    from "../components/dashboard/UpcomingCard.jsx";

// ── Stat Cards wired to real data ─────────────────────────
const StatCards = ({ overview }) => {
  const cards = [
    {
      label: "applications sent",
      display: String(overview?.total || 0),
      delta: "+8 from last week",
      positive: true,
    },
    {
      label: "response rate",
      display: `${overview?.responseRate || 0}%`,
      delta: "+2.1% from last week",
      positive: true,
    },
    {
      label: "time saved",
      display: `${overview?.timeSavedHours || 0}h`,
      delta: "+1.2h from last week",
      positive: true,
      color: "#1bd29c",
    },
    {
      label: "ai fills this month",
      display: `${overview?.aiFilledCount || 0}/15`,
      delta: `${15 - (overview?.aiFilledCount || 0)} remaining`,
      positive: null,
      color: "#ef9f27",
      warn: (overview?.aiFilledCount || 0) >= 12,
    },
  ];

  return (
    <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl p-4"
          style={{ border: card.warn ? "1px solid #fde68a" : "1px solid #f0f0f4" }}
        >
          <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            {card.label}
          </div>
          <div style={{ fontSize: 28, fontFamily: "Syne, sans-serif", fontWeight: 500, color: card.color || "#0a0a0f", marginBottom: 4, lineHeight: 1 }}>
            {card.display}
          </div>
          <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: card.positive === true ? "#1bd29c" : card.positive === false ? "#e24b4a" : "#9ca3af" }}>
            {card.positive === true && "↑ "}{card.positive === false && "↓ "}{card.delta}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Funnel wired to real data ─────────────────────────────
const FunnelChart = ({ funnel }) => {
  if (!funnel) return null;
  const total = funnel.applied || 1;
  const stages = [
    { stage: "Applied",   count: funnel.applied,   color: "#5b3df5" },
    { stage: "OA",        count: funnel.oa,         color: "#7f77dd" },
    { stage: "Interview", count: funnel.interview,  color: "#1bd29c" },
    { stage: "Final",     count: funnel.final || 0, color: "#0d9e7a" },
    { stage: "Offer",     count: funnel.offer,      color: "#0f6e56" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #f0f0f4" }}>
      <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>
        Conversion Funnel
      </div>
      <div className="flex flex-col gap-2">
        {stages.map((item) => (
          <div key={item.stage} className="flex items-center gap-2">
            <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", width: 52, textAlign: "right", flexShrink: 0 }}>
              {item.stage}
            </span>
            <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 14, background: "#f5f4ff" }}>
              <div
                className="h-full rounded-sm flex items-center"
                style={{
                  width: `${Math.round((item.count / total) * 100)}%`,
                  background: item.color,
                  paddingLeft: 6,
                  minWidth: item.count > 0 ? 20 : 0,
                  transition: "width 700ms ease",
                }}
              >
                <span style={{ fontSize: 8, fontFamily: "JetBrains Mono, monospace", color: "white" }}>
                  {item.count}
                </span>
              </div>
            </div>
            <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", width: 28 }}>
              {Math.round((item.count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Recent Apps wired to real data ────────────────────────
const STATUS_STYLE = {
  applied:   { bg: "#f0f0f4", color: "#6b7280" },
  oa:        { bg: "#ede8ff", color: "#5b3df5" },
  interview: { bg: "#e1f5ee", color: "#0f6e56" },
  rejected:  { bg: "#fcebeb", color: "#e24b4a" },
  offer:     { bg: "#e1f5ee", color: "#0f6e56" },
};
const ATS_STYLE = {
  greenhouse:  { bg: "#ede8ff", color: "#5b3df5" },
  workday:     { bg: "#f0f0f4", color: "#6b7280" },
  lever:       { bg: "#e1f5ee", color: "#0f6e56" },
  internshala: { bg: "#faeeda", color: "#854f0b" },
  naukri:      { bg: "#fcebeb", color: "#e24b4a" },
  other:       { bg: "#f0f0f4", color: "#6b7280" },
};

const RecentApps = ({ applications, onViewAll }) => (
  <div className="bg-white rounded-2xl mb-4" style={{ border: "1px solid #f0f0f4" }}>
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #f0f0f4" }}>
      <span style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f" }}>
        Recent Applications
      </span>
      <button onClick={onViewAll} style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#5b3df5", background: "none", border: "none", cursor: "pointer" }}>
        View all →
      </button>
    </div>
    {applications.slice(0, 8).map((app, i) => {
      const statusStyle = STATUS_STYLE[app.status] || STATUS_STYLE.applied;
      const atsStyle    = ATS_STYLE[(app.ats || "").toLowerCase()] || ATS_STYLE.other;
      const timeAgo     = app.appliedAt
        ? `${Math.floor((Date.now() - new Date(app.appliedAt)) / 86400000)}d ago`
        : "—";
      return (
        <div
          key={app._id || i}
          className="flex items-center gap-3 px-4 cursor-pointer transition-colors duration-100"
          style={{ height: 48, borderBottom: i < 7 ? "1px solid #f0f0f4" : "none" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f5f4ff"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 32, height: 32, background: "#ede8ff", fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500, color: "#5b3df5" }}
          >
            {app.company?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f" }} className="truncate">
              {app.company}
            </div>
            <div style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#6b7280" }} className="truncate">
              {app.role}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", ...atsStyle }}>
              {app.ats || "other"}
            </span>
            <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", ...statusStyle, textTransform: "capitalize" }}>
              {app.status}
            </span>
            <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", minWidth: 36, textAlign: "right" }}>
              {timeAgo}
            </span>
          </div>
        </div>
      );
    })}
    {applications.length === 0 && (
      <div style={{ padding: 24, textAlign: "center", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#b0b0c0" }}>
        No applications yet
      </div>
    )}
  </div>
);

// ── Dashboard Page ────────────────────────────────────────
const Dashboard = ({ onNavigate }) => {
  const { data: analytics, loading: analyticsLoading } = useAnalytics(30);
  const { applications,    loading: appsLoading       } = useApplications({ limit: 8 });

  const isLoading = analyticsLoading || appsLoading;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
            Dashboard
          </h1>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9ca3af" }}>
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {analytics && ` · ${analytics.overview?.total || 0} applications tracked`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full animate-pulse" style={{ width: 6, height: 6, background: "#1bd29c", display: "block" }} />
          <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#1bd29c" }}>Live</span>
          <span style={{ color: "#e0e0ea", margin: "0 4px" }}>·</span>
          <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>Predictor v1 active</span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9ca3af", padding: "24px 0" }}>
          Loading dashboard...
        </div>
      ) : (
        <>
          <TimelineStrip />
          <StatCards overview={analytics?.overview} />
          <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr" }}>
            <div>
              <RecentApps applications={applications} onViewAll={() => onNavigate("applications")} />
              <InsightCard />
            </div>
            <div>
              <FunnelChart funnel={analytics?.funnel} />
              <UpcomingCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;