import { useState, useEffect } from "react";

const DetailPanel = ({ app, onClose, onSaveNotes, onDelete }) => {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setNotes(app?.notes || "");
    setConfirmDelete(false);
  }, [app]);

  if (!app) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveNotes(notes);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await onDelete(app._id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const appliedDate = app.appliedAt
    ? new Date(app.appliedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ background: "rgba(0,0,0,0.08)" }}
      />
      <div
        className="fixed top-0 right-0 h-full bg-white z-50 overflow-y-auto"
        style={{
          width: 320,
          borderLeft: "1px solid #f0f0f4",
          animation: "slideIn 200ms ease-out",
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#0a0a0f",
                  marginBottom: 2,
                }}
              >
                {app.company}
              </h2>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                {app.role}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 28,
                height: 28,
                background: "#f0f0f4",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                color: "#6b7280",
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{ height: "0.5px", background: "#f0f0f4", marginBottom: 16 }}
          />
          <div className="mb-5">
            <div
              className="mb-2 uppercase tracking-widest"
              style={{
                fontSize: 9,
                fontFamily: "JetBrains Mono, monospace",
                color: "#9ca3af",
              }}
            >
              Match Score
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span
                style={{
                  fontSize: 28,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#5b3df5",
                  lineHeight: 1,
                }}
              >
                {app.matchScore ?? "—"}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#9ca3af",
                  marginBottom: 2,
                }}
              >
                /100
              </span>
            </div>
            <div
              className="rounded-full overflow-hidden mb-1"
              style={{ height: 4, background: "#f0f0f4" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${app.matchScore || 0}%`,
                  background: "#5b3df5",
                  transition: "width 600ms ease",
                }}
              />
            </div>
          </div>

          <div
            style={{ height: "0.5px", background: "#f0f0f4", marginBottom: 16 }}
          />
          <div className="mb-5">
            <div
              className="mb-3 uppercase tracking-widest"
              style={{
                fontSize: 9,
                fontFamily: "JetBrains Mono, monospace",
                color: "#9ca3af",
              }}
            >
              Timeline
            </div>
            {[
              { label: "Applied", date: appliedDate, done: true },
              {
                label: "OA Received",
                date: "—",
                done: ["oa", "interview", "offer"].includes(app.status),
              },
              {
                label: "Interview",
                date: "—",
                done: ["interview", "offer"].includes(app.status),
              },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 mb-3">
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-full shrink-0"
                    style={{
                      width: 8,
                      height: 8,
                      background: step.done ? "#5b3df5" : "#e0e0ea",
                      marginTop: 2,
                    }}
                  />
                  {i < 2 && (
                    <div
                      style={{
                        width: 1,
                        height: 20,
                        background: "#f0f0f4",
                        marginTop: 2,
                      }}
                    />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontFamily: "DM Sans, sans-serif",
                      color: step.done ? "#0a0a0f" : "#9ca3af",
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#9ca3af",
                    }}
                  >
                    {step.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{ height: "0.5px", background: "#f0f0f4", marginBottom: 16 }}
          />
          <div className="mb-4">
            <div
              className="mb-2 uppercase tracking-widest"
              style={{
                fontSize: 9,
                fontFamily: "JetBrains Mono, monospace",
                color: "#9ca3af",
              }}
            >
              Notes
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note..."
              className="w-full rounded-lg outline-none resize-none"
              style={{
                height: 72,
                border: "1px solid #e0e0ea",
                padding: "8px 10px",
                fontSize: 11,
                fontFamily: "DM Sans, sans-serif",
                color: "#374151",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5b3df5")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0ea")}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-2 rounded-lg text-white"
              style={{
                height: 28,
                padding: "0 16px",
                background: "#5b3df5",
                border: "none",
                fontSize: 11,
                fontFamily: "DM Sans, sans-serif",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          <div
            style={{ height: "0.5px", background: "#f0f0f4", marginBottom: 16 }}
          />
          
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full rounded-lg"
            style={{
              height: 32,
              background: confirmDelete ? "#fcebeb" : "transparent",
              border: `1px solid ${confirmDelete ? "#e24b4a" : "#e0e0ea"}`,
              color: "#e24b4a",
              fontSize: 12,
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              cursor: deleting ? "not-allowed" : "pointer",
            }}
          >
            {deleting
              ? "Deleting..."
              : confirmDelete
                ? "Click again to confirm delete"
                : "Delete Application"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailPanel;
