import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const ATS_STYLE = {
  greenhouse:  { bg: "#ede8ff", color: "#5b3df5" },
  workday:     { bg: "#f0f0f4", color: "#6b7280" },
  lever:       { bg: "#e1f5ee", color: "#0f6e56" },
  internshala: { bg: "#faeeda", color: "#854f0b" },
  naukri:      { bg: "#fcebeb", color: "#e24b4a" },
  other:       { bg: "#f0f0f4", color: "#6b7280" },
};

const KanbanCard = ({ app, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app._id,
    data: { app },
  });

  const atsKey   = (app.ats || "other").toLowerCase();
  const atsStyle = ATS_STYLE[atsKey] || ATS_STYLE.other;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1, 
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={() => !isDragging && onClick(app)}
      className="bg-white rounded-2xl p-3 cursor-grab active:cursor-grabbing"
      style={{
        ...style,
        border: "1px solid #f0f0f4",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500, color: "#0a0a0f" }}>
          {app.company}
        </span>
        <span
          className="rounded px-1.5 py-0.5"
          style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", ...atsStyle }}
        >
          {app.ats || "other"}
        </span>
      </div>

      <div style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#6b7280", marginBottom: 8 }}>
        {app.role}
      </div>

      <div className="flex items-center justify-between">
        <span
          className="rounded px-1.5 py-0.5"
          style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", background: "#ede8ff", color: "#5b3df5" }}
        >
          {app.matchScore ?? "—"}%
        </span>
        <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>
          {app.appliedAt
            ? new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : ""}
        </span>
      </div>
    </div>
  );
};

export default KanbanCard;