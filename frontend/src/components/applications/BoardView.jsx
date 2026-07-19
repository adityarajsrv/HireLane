// import { useState } from "react";
import { DndContext, pointerWithin } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard.jsx";
import { COLUMNS } from "../../data/mockApplications.js";
const DroppableColumn = ({ column, cards, onCardClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      className="flex flex-col shrink-0"
      style={{ width: 220 }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="uppercase tracking-widest"
          style={{
            fontSize: 10,
            fontFamily: "JetBrains Mono, monospace",
            color: "#9ca3af",
          }}
        >
          {column.label}
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: "JetBrains Mono, monospace",
            color: "#b0b0c0",
          }}
        >
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
          <KanbanCard key={app.id} app={app} onClick={onCardClick} />
        ))}
        {cards.length === 0 && (
          <div
            className="flex items-center justify-center flex-1"
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "#b0b0c0",
              minHeight: 80,
            }}
          >
            No applications
          </div>
        )}
      </div>
    </div>
  );
};

const BoardView = ({ applications, onApplicationsChange, onCardClick }) => {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter((a) => a.status === col.id);
    return acc;
  }, {});

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const draggedId   = active.id;
    const newStatus   = over.id; 

    const app = applications.find((a) => a.id === draggedId);
    if (!app || app.status === newStatus) return;

    const updated = applications.map((a) =>
      a.id === draggedId ? { ...a, status: newStatus } : a
    );
    onApplicationsChange(updated);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
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
    </DndContext>
  );
};

export default BoardView;