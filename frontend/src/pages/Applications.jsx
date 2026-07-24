import { useState } from "react";
import useApplications from "../hooks/useApplications.js";
import BoardView from "../components/applications/BoardView.jsx";
import ListView from "../components/applications/ListView.jsx";
import DetailPanel from "../components/applications/DetailPanel.jsx";
import AddApplicationModal from "../components/applications/AddApplicationModal.jsx";

const Applications = () => {
  const {
    applications,
    loading,
    updateStatus,
    updateApplication,
    createApplication,
    deleteApplication,
  } = useApplications();

  const [view, setView] = useState("board");
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [createError, setCreateError] = useState("");

  const filtered = applications.filter(
    (a) =>
      a.company?.toLowerCase().includes(search.toLowerCase()) ||
      a.role?.toLowerCase().includes(search.toLowerCase()) ||
      a.ats?.toLowerCase().includes(search.toLowerCase()),
  );

  const liveSelectedApp = selectedApp
    ? applications.find((a) => a._id === selectedApp._id) || selectedApp
    : null;

  const handleCreate = async (data) => {
    setCreateError("");
    try {
      await createApplication(data);
    } catch (err) {
      setCreateError(
        err.response?.data?.message || "Failed to create application.",
      );
      throw err;
    }
  };

  if (loading)
    return (
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11,
          color: "#9ca3af",
          padding: 24,
        }}
      >
        Loading applications...
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 22,
              fontWeight: 500,
              color: "#0a0a0f",
              marginBottom: 4,
            }}
          >
            Applications
          </h1>
          <span
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "#9ca3af",
            }}
          >
            {applications.length} / 20 tracked (free plan)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex p-0.5 rounded-xl"
            style={{ background: "#f0f0f4", border: "1px solid #e8e8f0" }}
          >
            {["board", "list"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  height: 28,
                  padding: "0 14px",
                  borderRadius: 9,
                  border: "none",
                  fontSize: 12,
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  background: view === v ? "white" : "transparent",
                  color: view === v ? "#0a0a0f" : "#9ca3af",
                  boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                }}
              >
                {v === "board" ? "Board" : "List"}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setCreateError("");
              setShowAddModal(true);
            }}
            style={{
              height: 32,
              padding: "0 14px",
              background: "white",
              border: "1px solid #e0e0ea",
              borderRadius: 10,
              fontSize: 12,
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              color: "#0a0a0f",
              cursor: "pointer",
            }}
          >
            + Add Application
          </button>
        </div>
      </div>

      {createError && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 12px",
            background: "#fcebeb",
            borderRadius: 8,
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
            color: "#e24b4a",
          }}
        >
          {createError}
        </div>
      )}

      <div
        className="flex items-center gap-2 mb-5 rounded-xl px-3"
        style={{ height: 36, background: "white", border: "1px solid #f0f0f4" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company, role, or ATS..."
          className="flex-1 bg-transparent outline-none border-none"
          style={{
            fontSize: 12,
            fontFamily: "DM Sans, sans-serif",
            color: "#0a0a0f",
          }}
        />
      </div>

      {view === "board" ? (
        <BoardView
          applications={filtered}
          onStatusChange={updateStatus}
          onCardClick={setSelectedApp}
        />
      ) : (
        <ListView applications={filtered} onRowClick={setSelectedApp} />
      )}

      <DetailPanel
        app={liveSelectedApp}
        onClose={() => setSelectedApp(null)}
        onSaveNotes={(notes) => updateApplication(selectedApp._id, { notes })}
        onDelete={deleteApplication}
      />

      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default Applications;
