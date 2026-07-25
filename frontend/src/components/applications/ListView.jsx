import { useState } from "react";

const STATUS_STYLE = {
  applied: { bg: "#f0f0f4", color: "#6b7280" },
  oa: { bg: "#ede8ff", color: "#5b3df5" },
  interview: { bg: "#e1f5ee", color: "#0f6e56" },
  rejected: { bg: "#fcebeb", color: "#e24b4a" },
  offer: { bg: "#e1f5ee", color: "#0f6e56" },
};
const ATS_STYLE = {
  greenhouse: { bg: "#ede8ff", color: "#5b3df5" },
  workday: { bg: "#f0f0f4", color: "#6b7280" },
  lever: { bg: "#e1f5ee", color: "#0f6e56" },
  internshala: { bg: "#faeeda", color: "#854f0b" },
  naukri: { bg: "#fcebeb", color: "#e24b4a" },
  other: { bg: "#f0f0f4", color: "#6b7280" },
};

const ListView = ({ applications, onRowClick, onBulkDelete }) => {
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const toggleSelect = (id) => {
    setConfirmBulk(false); 
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setConfirmBulk(false);
    setSelected(
      selected.length === applications.length ? [] : applications.map((a) => a._id)
    );
  };

  const handleBulkDelete = async () => {
    if (!confirmBulk) {
      setConfirmBulk(true);
      return;
    }
    setDeleting(true);
    try {
      await onBulkDelete(selected);
      setSelected([]);
      setConfirmBulk(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #f0f0f4", background: "white" }}>
            <th style={{ width: 40, padding: "10px 12px" }} onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selected.length === applications.length && applications.length > 0}
                onChange={toggleAll}
                style={{ accentColor: "#5b3df5", cursor: "pointer" }}
              />
            </th>
            {["Company", "Role", "ATS", "Status", "Match", "Date"].map((h) => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {h}
              </th>
            ))}
            <th style={{ width: 40 }} />
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const isSelected = selected.includes(app._id);
            const statusStyle = STATUS_STYLE[app.status] || STATUS_STYLE.applied;
            const atsStyle = ATS_STYLE[(app.ats || "other").toLowerCase()] || ATS_STYLE.other;
            const dateStr = app.appliedAt
              ? new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "—";

            return (
              <tr
                key={app._id}
                onClick={() => onRowClick(app)}
                style={{ borderBottom: "1px solid #f0f0f4", background: isSelected ? "#f5f4ff" : "white", cursor: "pointer", transition: "background 100ms" }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#fafafa"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "white"; }}
              >
                <td style={{ padding: "0 12px", width: 40 }} onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(app._id)} style={{ accentColor: "#5b3df5", cursor: "pointer" }} />
                </td>
                <td style={{ padding: "0 12px", height: 44 }}>
                  <span style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f" }}>{app.company}</span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#6b7280" }}>{app.role}</span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", ...atsStyle }}>{app.ats}</span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", ...statusStyle, textTransform: "capitalize" }}>{app.status}</span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5" }}>{app.matchScore ?? "—"}%</span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>{dateStr}</span>
                </td>
                <td style={{ padding: "0 12px", width: 40 }} onClick={(e) => e.stopPropagation()}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16, padding: "4px 6px", borderRadius: 6 }}>···</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selected.length > 0 && (
        <div
          className="fixed flex items-center gap-3 px-4 py-2 bg-white rounded-2xl"
          style={{ bottom: 24, left: "50%", transform: "translateX(-50%)", border: "1px solid #f0f0f4", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", zIndex: 50 }}
        >
          <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#6b7280" }}>
            {selected.length} selected
          </span>

          <button
            onClick={handleBulkDelete}
            disabled={deleting}
            style={{
              fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 500,
              color: confirmBulk ? "white" : "#e24b4a",
              background: confirmBulk ? "#e24b4a" : "#fcebeb",
              border: "none", borderRadius: 8, padding: "6px 12px",
              cursor: deleting ? "not-allowed" : "pointer",
            }}
          >
            {deleting ? "Deleting..." : confirmBulk ? `Confirm delete (${selected.length})` : `Delete (${selected.length})`}
          </button>

          <button
            onClick={() => { setSelected([]); setConfirmBulk(false); }}
            style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ListView;