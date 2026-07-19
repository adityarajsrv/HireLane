import {
  LayoutGrid,
  Briefcase,
  Search,
  BarChart3,
  TrendingUp,
  Database,
  User,
  Settings,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { id: "dashboard", label: "Dashboard" },
      { id: "applications", label: "Applications" },
      { id: "jdmatch", label: "JD Match" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { id: "analytics", label: "Analytics" },
      { id: "predictor", label: "Predictor" },
      { id: "cache", label: "Cache Monitor" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { id: "profile", label: "Profile" },
      { id: "settings", label: "Settings" },
    ],
  },
];

const Icon = ({ id }) => {
  const props = {
    size: 15,
    strokeWidth: 1.8,
  };

  const icons = {
    dashboard: <LayoutGrid {...props} />,
    applications: <Briefcase {...props} />,
    jdmatch: <Search {...props} />,
    analytics: <BarChart3 {...props} />,
    predictor: <TrendingUp {...props} />,
    cache: <Database {...props} />,
    profile: <User {...props} />,
    settings: <Settings {...props} />,
  };

  return icons[id] || null;
};

const Sidebar = ({ activePage, onNavigate }) => {
  return (
    <aside
      className="flex flex-col bg-white border-r border-[#f0f0f4] shrink-0"
      style={{ width: 220 }}
    >
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <div
                className="px-4 pb-1 text-[#b0b0c0] uppercase tracking-widest"
                style={{
                  fontSize: 9,
                  fontFamily: "JetBrains Mono, monospace",
                  paddingTop: 12,
                }}
              >
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="w-full flex items-center gap-2.5 text-left transition-colors duration-100"
                  style={{
                    height: 36,
                    paddingLeft: isActive ? 10 : 12,
                    paddingRight: 12,
                    marginLeft: 8,
                    marginRight: 8,
                    width: "calc(100% - 16px)",
                    borderRadius: 10,
                    borderLeft: isActive
                      ? "2px solid #5b3df5"
                      : "2px solid transparent",
                    background: isActive ? "#ede8ff" : "transparent",
                    color: isActive ? "#5b3df5" : "#6b7280",
                    fontSize: 13,
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "none",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f5f4ff";
                      e.currentTarget.style.color = "#0a0a0f";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#6b7280";
                    }
                  }}
                >
                  <span
                    style={{
                      color: isActive ? "#5b3df5" : "#9ca3af",
                      display: "flex",
                    }}
                  >
                    <Icon id={item.id} />
                  </span>
                  {item.label}
                </button>
              );
            })}
            {gi < NAV_GROUPS.length - 1 && (
              <div
                className="mx-4 my-2 bg-[#f0f0f4]"
                style={{ height: "0.5px" }}
              />
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-[#f0f0f4] p-3">
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <span
            className="rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "#1bd29c",
              flexShrink: 0,
            }}
          />
          <span
            className="text-[#9ca3af]"
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Extension active
          </span>
        </div>

        <div className="flex items-center gap-2 px-1">
          <div
            className="flex items-center justify-center rounded-full text-white shrink-0"
            style={{
              width: 30,
              height: 30,
              background: "#5b3df5",
              fontSize: 10,
              fontFamily: "Syne, sans-serif",
              fontWeight: 600,
            }}
          >
            AK
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="text-[#0a0a0f] truncate"
              style={{
                fontSize: 12,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
              }}
            >
              Aryan Kumar
            </div>

            <div
              className="text-[#9ca3af]"
              style={{
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Free Plan
            </div>
          </div>

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;