import { useState } from "react";
import {
  DndContext, DragOverlay,
  useSensor, useSensors, PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard.jsx";

const COLUMNS = [
  { id: "applied",   label: "Applied"   },
  { id: "oa",        label: "OA"        },
  { id: "interview", label: "Interview" },
  { id: "rejected",  label: "Rejected"  },
  { id: "offer",     label: "Offer"     },
];

const DroppableColumn = ({ column, cards, onCardClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col shrink-0" style={{ width: 220 }}>
      <div className="flex items-center gap-2 mb-3 px-1">
        <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase" }}>
          {column.label}
        </span>
        <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#b0b0c0" }}>
          {cards.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 flex-1 rounded-2xl p-2 min-h-32 transition-colors duration-150"
        style={{
          background: isOver ? "#ede8ff" : "#f5f4ff",
          border: isOver ? "1px dashed #5b3df5" : "1px solid transparent",
        }}
      >
        {cards.map((app) => (
          <KanbanCard key={app._id} app={app} onClick={onCardClick} />
        ))}
        {cards.length === 0 && (
          <div
            className="flex items-center justify-center flex-1"
            style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#b0b0c0", minHeight: 80 }}
          >
            No applications
          </div>
        )}
      </div>
    </div>
  );
};

const BoardView = ({ applications, onStatusChange, onCardClick }) => {
  const [activeApp, setActiveApp] = useState(null); 

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter((a) => a.status === col.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    const app = applications.find((a) => a._id === event.active.id);
    setActiveApp(app || null);
  };

  const handleDragEnd = async (event) => {
    setActiveApp(null);
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id;      
    const newStatus = over.id;        

    const app = applications.find((a) => a._id === draggedId);
    if (!app || app.status === newStatus) return;

    try {
      await onStatusChange(draggedId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <DroppableColumn
            key={col.id}
            column={col}
            cards={grouped[col.id] || []}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeApp ? (
          <div style={{ width: 220, opacity: 0.95, cursor: "grabbing" }}>
            <KanbanCard app={activeApp} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardView;