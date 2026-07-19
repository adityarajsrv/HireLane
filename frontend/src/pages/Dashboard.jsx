import StatCards     from "../components/dashboard/StatCards.jsx";
import TimelineStrip from "../components/dashboard/TimelineStrip.jsx";
import RecentApps    from "../components/dashboard/RecentApps.jsx";
import FunnelChart   from "../components/dashboard/FunnelChart.jsx";
import InsightCard   from "../components/dashboard/InsightCard.jsx";
import UpcomingCard  from "../components/dashboard/UpcomingCard.jsx";

const Dashboard = ({ onNavigate }) => {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
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
            Dashboard
          </h1>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric"
            })}
            {" · 34 applications tracked"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full animate-pulse"
            style={{ width: 6, height: 6, background: "#1bd29c", display: "block" }}
          />
          <span
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#1bd29c",
            }}
          >
            Live
          </span>
          <span style={{ color: "#f0f0f4" }}>·</span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#9ca3af",
            }}
          >
            Predictor v1 active
          </span>
        </div>
      </div>
      <TimelineStrip />
      <StatCards />
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "3fr 2fr" }}
      >
        <div>
          <RecentApps onViewAll={() => onNavigate("applications")} />
          <InsightCard />
        </div>
        <div>
          <FunnelChart />
          <UpcomingCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;