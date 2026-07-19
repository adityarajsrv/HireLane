import { useDraggable } from "@dnd-kit/core";
import { ATS_STYLE } from "../../data/mockApplications.js";

const KanbanCard = ({ app, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    data: { app }, 
  });

  const atsStyle = ATS_STYLE[app.ats] || ATS_STYLE.Workday;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => !isDragging && onClick(app)}
      className="bg-white rounded-2xl p-3 cursor-grab active:cursor-grabbing"
      style={{
        border: "1px solid #f0f0f4",
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        boxShadow: isDragging ? "0 8px 24px rgba(91,61,245,0.15)" : "none",
        opacity:   isDragging ? 0.9 : 1,
        rotate:    isDragging ? "1deg" : "0deg",
        zIndex:    isDragging ? 999 : "auto",
        scale:     isDragging ? "1.02" : "1",
        transition: isDragging ? "none" : "box-shadow 150ms, border-color 150ms",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          style={{
            fontSize: 13,
            fontFamily: "Syne, sans-serif",
            fontWeight: 500,
            color: "#0a0a0f",
          }}
        >
          {app.company}
        </span>
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
      </div>
      <div
        style={{
          fontSize: 11,
          fontFamily: "DM Sans, sans-serif",
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        {app.role}
      </div>
      <div className="flex items-center justify-between">
        <span
          className="rounded px-1.5 py-0.5"
          style={{
            fontSize: 10,
            fontFamily: "JetBrains Mono, monospace",
            background: "#ede8ff",
            color: "#5b3df5",
          }}
        >
          {app.matchScore}%
        </span>
        <span
          style={{
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            color: "#9ca3af",
          }}
        >
          {app.date}
        </span>
      </div>
    </div>
  );
};

export default KanbanCard;