// import { useEffect, useState } from "react";
import useApplications from "../../hooks/useApplications.js";
import useQuota from "../../hooks/useQuota.js";

const SectionLabel = ({ children }) => (
  <div
    className="text-[#b0b0c0] uppercase tracking-widest mb-2"
    style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
  >
    {children}
  </div>
);

const buildActivityFeed = (applications) => {
  const events = [];

  applications.forEach((app) => {
    const created = new Date(app.createdAt).getTime();
    const updated = new Date(app.updatedAt).getTime();

    if (updated - created > 5000) {
      events.push({
        text: `${app.company} moved to ${app.status}`,
        time: app.updatedAt,
        color:
          app.status === "offer"
            ? "#1bd29c"
            : app.status === "rejected"
              ? "#e24b4a"
              : app.status === "interview"
                ? "#1bd29c"
                : "#5b3df5",
      });
    }

    events.push({
      text: `Added ${app.company} — ${app.role}`,
      time: app.createdAt,
      color: "#5b3df5",
    });
  });

  return events.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);
};

const timeAgo = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const DiagnosticsPanel = () => {
  const { applications, loading: appsLoading } = useApplications();
  const { quota, loading: quotaLoading } = useQuota();

  const feed = buildActivityFeed(applications);

  return (
    <aside
      className="flex flex-col bg-white border-l border-[#f0f0f4] shrink-0 overflow-y-auto"
      style={{ width: 240 }}
    >
      <div className="p-3 border-b border-[#f0f0f4]">
        <SectionLabel>Your Quota</SectionLabel>
        {quotaLoading ? (
          <div
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#b0b0c0",
            }}
          >
            Loading...
          </div>
        ) : quota ? (
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex justify-between mb-1">
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#9ca3af",
                  }}
                >
                  AI calls today
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#5b3df5",
                  }}
                >
                  {quota.aiCallsUsed}/{quota.aiCallsLimit}
                </span>
              </div>
              <div
                className="rounded-full overflow-hidden"
                style={{ height: 3, background: "#f0f0f4" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (quota.aiCallsUsed / quota.aiCallsLimit) * 100)}%`,
                    background:
                      quota.aiCallsUsed >= quota.aiCallsLimit
                        ? "#e24b4a"
                        : "#5b3df5",
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#9ca3af",
                  }}
                >
                  Fills this month
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#5b3df5",
                  }}
                >
                  {quota.fillsUsed}/{quota.fillsLimit}
                </span>
              </div>
              <div
                className="rounded-full overflow-hidden"
                style={{ height: 3, background: "#f0f0f4" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (quota.fillsUsed / quota.fillsLimit) * 100)}%`,
                    background: "#1bd29c",
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="p-3 flex-1">
        <SectionLabel>Activity</SectionLabel>
        {appsLoading ? (
          <div
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#b0b0c0",
            }}
          >
            Loading...
          </div>
        ) : feed.length === 0 ? (
          <div
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#b0b0c0",
            }}
          >
            No activity yet
          </div>
        ) : (
          <div className="flex flex-col">
            {feed.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-1.5 py-1.5 border-b border-[#f0f0f4] last:border-0"
              >
                <span
                  className="rounded-full shrink-0"
                  style={{
                    width: 5,
                    height: 5,
                    background: item.color,
                    marginTop: 4,
                  }}
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
                    style={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono, monospace",
                      marginTop: 1,
                    }}
                  >
                    {timeAgo(item.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default DiagnosticsPanel;
