import { useState } from "react";
import { STATUS_STYLE, ATS_STYLE } from "../../data/mockApplications.js";

const ListView = ({ applications }) => {
  const [selected, setSelected] = useState([]); 

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === applications.length ? [] : applications.map((a) => a.id)
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #f0f0f4",
              background: "white",
            }}
          >
            <th style={{ width: 40, padding: "10px 12px" }}>
              <input
                type="checkbox"
                checked={selected.length === applications.length && applications.length > 0}
                onChange={toggleAll}
                style={{ accentColor: "#5b3df5", cursor: "pointer" }}
              />
            </th>
            {["Company", "Role", "ATS", "Status", "Match", "Date"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#9ca3af",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {h}
              </th>
            ))}
            <th style={{ width: 40 }} />
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const isSelected  = selected.includes(app.id);
            const statusStyle = STATUS_STYLE[app.status] || STATUS_STYLE.applied;
            const atsStyle    = ATS_STYLE[app.ats]       || ATS_STYLE.Workday;

            return (
              <tr
                key={app.id}
                style={{
                  borderBottom: "1px solid #f0f0f4",
                  background: isSelected ? "#f5f4ff" : "white",
                  cursor: "pointer",
                  transition: "background 100ms",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "white";
                }}
              >
                <td style={{ padding: "0 12px", width: 40 }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(app.id)}
                    style={{ accentColor: "#5b3df5", cursor: "pointer" }}
                  />
                </td>
                <td style={{ padding: "0 12px", height: 44 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                      color: "#0a0a0f",
                    }}
                  >
                    {app.company}
                  </span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "DM Sans, sans-serif",
                      color: "#6b7280",
                    }}
                  >
                    {app.role}
                  </span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span
                    className="rounded px-1.5 py-0.5"
                    style={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono, monospace",
                      background: atsStyle.bg,
                      color: atsStyle.color,
                    }}
                  >
                    {app.ats}
                  </span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono, monospace",
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      textTransform: "capitalize",
                    }}
                  >
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#5b3df5",
                    }}
                  >
                    {app.matchScore}%
                  </span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#9ca3af",
                    }}
                  >
                    {app.date}
                  </span>
                </td>
                <td style={{ padding: "0 12px", width: 40 }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9ca3af",
                      fontSize: 16,
                      padding: "4px 6px",
                      borderRadius: 6,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f4"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  >
                    ···
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selected.length > 0 && (
        <div
          className="fixed flex items-center gap-4 px-4 py-2 bg-white rounded-2xl"
          style={{
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            border: "1px solid #f0f0f4",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            zIndex: 50,
            animation: "slideUp 200ms ease-out",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateX(-50%) translateY(8px); opacity: 0; }
              to   { transform: translateX(-50%) translateY(0);   opacity: 1; }
            }
          `}</style>
          <span
            style={{
              fontSize: 12,
              fontFamily: "JetBrains Mono, monospace",
              color: "#6b7280",
            }}
          >
            {selected.length} selected
          </span>
          <button
            style={{
              fontSize: 12,
              fontFamily: "DM Sans, sans-serif",
              color: "#0a0a0f",
              background: "#f0f0f4",
              border: "none",
              borderRadius: 8,
              padding: "5px 12px",
              cursor: "pointer",
            }}
          >
            Move to ▾
          </button>
          <button
            onClick={() => setSelected([])}
            style={{
              fontSize: 12,
              fontFamily: "DM Sans, sans-serif",
              color: "#e24b4a",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ListView;