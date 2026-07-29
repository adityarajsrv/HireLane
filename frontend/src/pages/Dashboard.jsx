import { useMemo } from "react";
import useAnalytics    from "../hooks/useAnalytics.js";
import useApplications from "../hooks/useApplications.js";
import useQuota from "../hooks/useQuota.js";
import ProfileCompletenessBanner from "../components/profile/ProfileCompletenessBanner.jsx";

const TimelineStrip = ({ timeline }) => {
  const days = useMemo(() => {
    const map = {};
    timeline.forEach((t) => { map[t._id] = t; });

    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entry = map[key];
      result.push({
        count: entry?.count || 0,
        aiUsed: entry?.aiUsed || 0,
        isToday: i === 0,
      });
    }
    return result;
  }, [timeline]);

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-2xl p-3 mb-4" style={{ border: "1px solid #f0f0f4" }}>
      <div className="flex items-end gap-0.5" style={{ height: 36 }}>
        {days.map((day, i) => {
          const h = day.count === 0 ? 3 : Math.max(4, (day.count / maxCount) * 32);
          const color = day.isToday ? "#5b3df5" : day.aiUsed > 0 ? "rgba(91,61,245,0.45)" : "#e8e8f0";
          return (
            <div
              key={i}
              className="rounded-t-sm flex-1"
              style={{
                height: h, minWidth: 6, background: color,
                transition: `height 400ms ease ${i * 10}ms`,
                animation: day.isToday ? "breathe 1.5s ease-in-out infinite" : "none",
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full" style={{ width: 6, height: 6, background: "rgba(91,61,245,0.45)" }} />
          <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>Applied w/ match score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full" style={{ width: 6, height: 6, background: "#e8e8f0" }} />
          <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>Applied</span>
        </div>
      </div>
      <style>{`@keyframes breathe { 0%,100% {opacity:1} 50% {opacity:.5} }`}</style>
    </div>
  );
};

const StatCards = ({ overview, quota, weekDelta }) => {
  const cards = [
    {
      label: "applications sent",
      display: String(overview?.total || 0),
      delta: weekDelta === null ? null : `${weekDelta >= 0 ? "+" : ""}${weekDelta} this week vs last`,
      positive: weekDelta === null ? null : weekDelta >= 0,
    },
    {
      label: "response rate",
      display: `${overview?.responseRate || 0}%`,
      delta: null,
      positive: null,
    },
    {
      label: "est. time saved",
      display: `${overview?.timeSavedHours || 0}h`,
      delta: null,
      positive: null,
      color: "#1bd29c",
    },
    {
      label: "ai calls today",
      display: quota ? `${quota.aiCallsUsed}/${quota.aiCallsLimit}` : "—",
      delta: quota ? `${quota.aiCallsLimit - quota.aiCallsUsed} remaining` : "",
      positive: null,
      color: "#ef9f27",
      warn: quota && quota.aiCallsUsed >= quota.aiCallsLimit - 1,
    },
  ];

  return (
    <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-2xl p-4" style={{ border: card.warn ? "1px solid #fde68a" : "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            {card.label}
          </div>
          <div style={{ fontSize: 28, fontFamily: "Syne, sans-serif", fontWeight: 500, color: card.color || "#0a0a0f", marginBottom: 4, lineHeight: 1 }}>
            {card.display}
          </div>
          {card.delta && (
            <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: card.positive === true ? "#1bd29c" : card.positive === false ? "#e24b4a" : "#9ca3af" }}>
              {card.positive === true && "↑ "}{card.positive === false && "↓ "}{card.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const FunnelChart = ({ funnel }) => {
  if (!funnel) return null;
  const total = Object.values(funnel).reduce((a, b) => a + b, 0) || 1;
  const stages = [
    { stage: "Applied",   count: funnel.applied,   color: "#5b3df5" },
    { stage: "OA",        count: funnel.oa,         color: "#7f77dd" },
    { stage: "Interview", count: funnel.interview,  color: "#1bd29c" },
    { stage: "Offer",     count: funnel.offer,      color: "#0f6e56" },
    { stage: "Rejected",  count: funnel.rejected,   color: "#e24b4a" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #f0f0f4" }}>
      <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>
        Application Breakdown
      </div>
      <div className="flex flex-col gap-2">
        {stages.map((item) => {
          const pct = Math.round((item.count / total) * 100);
          return (
            <div key={item.stage} className="flex items-center gap-2">
              <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", width: 60, textAlign: "right", flexShrink: 0 }}>{item.stage}</span>
              <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 14, background: "#f5f4ff" }}>
                <div className="h-full rounded-sm flex items-center" style={{ width: `${pct}%`, background: item.color, paddingLeft: 6, minWidth: item.count > 0 ? 20 : 0, transition: "width 700ms ease" }}>
                  <span style={{ fontSize: 8, fontFamily: "JetBrains Mono, monospace", color: "white" }}>{item.count}</span>
                </div>
              </div>
              <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", width: 28 }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InsightCard = ({ insights, platforms }) => {
  if (!insights?.bestPlatform || platforms.length < 2) {
    return (
      <div className="bg-white rounded-2xl p-4 mt-4" style={{ border: "1px solid #f0f0f4" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full" style={{ width: 5, height: 5, background: "#5b3df5" }} />
          <span className="uppercase tracking-widest text-[#9ca3af]" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}>Insight</span>
        </div>
        <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#9ca3af" }}>
          Apply to a few more roles across different ATS platforms to unlock personalised insights.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 mt-4" style={{ border: "1px solid #f0f0f4" }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded-full animate-pulse" style={{ width: 5, height: 5, background: "#5b3df5" }} />
        <span className="uppercase tracking-widest text-[#9ca3af]" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}>Insight</span>
      </div>
      <p style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#374151", lineHeight: 1.6 }}>
        <strong style={{ textTransform: "capitalize" }}>{insights.bestPlatform}</strong> is converting better than{" "}
        <strong style={{ textTransform: "capitalize" }}>{insights.worstPlatform}</strong> for your applications
        {insights.conversionGap > 0 ? ` (${insights.conversionGap}% gap).` : "."} Consider prioritising roles there.
      </p>
    </div>
  );
};

const UpcomingCard = ({ applications }) => {
  const withDeadlines = applications
    .filter((a) => a.deadline && new Date(a.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl mt-4" style={{ border: "1px solid #f0f0f4" }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #f0f0f4" }}>
        <span style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f" }}>Upcoming Deadlines</span>
      </div>
      {withDeadlines.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center", fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#b0b0c0" }}>
          No deadlines set. Add one when creating an application.
        </div>
      ) : withDeadlines.map((app) => {
        const daysLeft = Math.ceil((new Date(app.deadline) - new Date()) / 86400000);
        const urgent = daysLeft <= 3;
        return (
          <div key={app._id} className="flex items-center gap-3 px-4" style={{ height: 40, borderBottom: "1px solid #f0f0f4" }}>
            <span style={{ color: urgent ? "#ef9f27" : "#9ca3af", fontSize: 12 }}>●</span>
            <span className="flex-1 truncate" style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#374151" }}>
              {app.company} — {app.role}
            </span>
            <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: urgent ? "#faeeda" : "#f0f0f4", color: urgent ? "#ef9f27" : "#9ca3af" }}>
              {daysLeft}d
            </span>
          </div>
        );
      })}
    </div>
  );
};

const STATUS_STYLE = { applied: { bg: "#f0f0f4", color: "#6b7280" }, oa: { bg: "#ede8ff", color: "#5b3df5" }, interview: { bg: "#e1f5ee", color: "#0f6e56" }, rejected: { bg: "#fcebeb", color: "#e24b4a" }, offer: { bg: "#e1f5ee", color: "#0f6e56" } };
const ATS_STYLE = { greenhouse: { bg: "#ede8ff", color: "#5b3df5" }, workday: { bg: "#f0f0f4", color: "#6b7280" }, lever: { bg: "#e1f5ee", color: "#0f6e56" }, internshala: { bg: "#faeeda", color: "#854f0b" }, naukri: { bg: "#fcebeb", color: "#e24b4a" }, other: { bg: "#f0f0f4", color: "#6b7280" } };

const RecentApps = ({ applications, onViewAll }) => (
  <div className="bg-white rounded-2xl mb-4" style={{ border: "1px solid #f0f0f4" }}>
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #f0f0f4" }}>
      <span style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f" }}>Recent Applications</span>
      <button onClick={onViewAll} style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#5b3df5", background: "none", border: "none", cursor: "pointer" }}>View all →</button>
    </div>
    {applications.slice(0, 8).map((app, i) => {
      const statusStyle = STATUS_STYLE[app.status] || STATUS_STYLE.applied;
      const atsStyle = ATS_STYLE[(app.ats || "").toLowerCase()] || ATS_STYLE.other;
      const timeAgo = app.appliedAt ? `${Math.floor((Date.now() - new Date(app.appliedAt)) / 86400000)}d ago` : "—";
      return (
        <div key={app._id || i} className="flex items-center gap-3 px-4 cursor-pointer transition-colors duration-100" style={{ height: 48, borderBottom: i < 7 ? "1px solid #f0f0f4" : "none" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f5f4ff"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 32, height: 32, background: "#ede8ff", fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500, color: "#5b3df5" }}>
            {app.company?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f" }} className="truncate">{app.company}</div>
            <div style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#6b7280" }} className="truncate">{app.role}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", ...atsStyle }}>{app.ats || "other"}</span>
            <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", ...statusStyle, textTransform: "capitalize" }}>{app.status}</span>
            <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", minWidth: 36, textAlign: "right" }}>{timeAgo}</span>
          </div>
        </div>
      );
    })}
    {applications.length === 0 && <div style={{ padding: 24, textAlign: "center", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#b0b0c0" }}>No applications yet</div>}
  </div>
);

const Dashboard = ({ onNavigate }) => {
  const { data: analytics, loading: analyticsLoading } = useAnalytics(30);
  const { applications, loading: appsLoading } = useApplications({ limit: 8 });
  const { applications: allApps } = useApplications(); 

  const isLoading = analyticsLoading || appsLoading;

  const weekDelta = useMemo(() => {
    if (!analytics?.timeline) return null;
    const now = Date.now();
    let thisWeek = 0, lastWeek = 0;
    analytics.timeline.forEach((t) => {
      const days = (now - new Date(t._id).getTime()) / 86400000;
      if (days <= 7) thisWeek += t.count;
      else if (days <= 14) lastWeek += t.count;
    });
    return thisWeek - lastWeek;
  }, [analytics]);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>Dashboard</h1>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9ca3af" }}>
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {analytics && ` · ${analytics.overview?.total || 0} applications tracked`}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9ca3af", padding: "24px 0" }}>Loading dashboard...</div>
      ) : (
        <>
          <ProfileCompletenessBanner onNavigate={onNavigate} />
          <TimelineStrip timeline={analytics?.timeline || []} />
          <DashboardStatsWithQuota overview={analytics?.overview} weekDelta={weekDelta} />
          <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr" }}>
            <div>
              <RecentApps applications={applications} onViewAll={() => onNavigate("applications")} />
              <InsightCard insights={analytics?.insights} platforms={analytics?.platforms || []} />
            </div>
            <div>
              <FunnelChart funnel={analytics?.funnel} />
              <UpcomingCard applications={allApps} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DashboardStatsWithQuota = ({ overview, weekDelta }) => {
  const { quota } = useQuota();
  return <StatCards overview={overview} quota={quota} weekDelta={weekDelta} />;
};

export default Dashboard;