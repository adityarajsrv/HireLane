import {
  LayoutGrid,
  Briefcase,
  Search,
  BarChart3,
  Lightbulb,
  User,
  Settings,
  Puzzle,
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
      { id: "insights", label: "Insights" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { id: "profile", label: "Profile" },
      { id: "settings", label: "Settings" },
      { id: "extension", label: "Extension" },
    ],
  }
];

const Icon = ({ id }) => {
  const props = { size: 15, strokeWidth: 1.8 };
  const icons = {
    dashboard: <LayoutGrid {...props} />,
    applications: <Briefcase {...props} />,
    jdmatch: <Search {...props} />,
    analytics: <BarChart3 {...props} />,
    insights: <Lightbulb {...props} />,
    profile: <User {...props} />,
    settings: <Settings {...props} />,
    extension: <Puzzle {...props} />,
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
    </aside>
  );
};

export default Sidebar;
