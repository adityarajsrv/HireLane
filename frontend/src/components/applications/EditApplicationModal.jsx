import { useState } from "react";

const ATS_OPTIONS    = ["workday", "greenhouse", "internshala", "naukri", "wellfound", "other"];
const STATUS_OPTIONS = ["applied", "oa", "interview", "rejected", "offer"];

const inputStyle = {
  height: 36, padding: "0 12px", border: "1px solid #e0e0ea", borderRadius: 8,
  fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#0a0a0f", width: "100%", outline: "none", boxSizing: "border-box",
};
const labelStyle = {
  display: "block", marginBottom: 4, fontSize: 9, fontFamily: "JetBrains Mono, monospace",
  color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em",
};

// Reuses the exact same visual language as AddApplicationModal, but
// pre-filled from an existing application and calling PATCH instead
// of POST — same component shape, different backend verb and intent.
const EditApplicationModal = ({ application, onClose, onSave }) => {
  const [form, setForm] = useState({
    company:    application.company || "",
    role:       application.role || "",
    ats:        application.ats || "other",
    status:     application.status || "applied",
    matchScore: application.matchScore ?? "",
    notes:      application.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError ] = useState("");

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and role are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(application._id, {
        company: form.company.trim(),
        role: form.role.trim(),
        ats: form.ats,
        status: form.status,
        matchScore: form.matchScore === "" ? null : Number(form.matchScore),
        notes: form.notes,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update application.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} style={{ background: "rgba(0,0,0,0.15)" }} />
      <div
        className="fixed z-50 bg-white rounded-2xl p-5"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 380, border: "1px solid #f0f0f4", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
      >
        <div style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>
          Edit Application
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label style={labelStyle}>Company</label>
            <input style={inputStyle} value={form.company} onChange={set("company")} />
          </div>
          <div>
            <label style={labelStyle}>Role</label>
            <input style={inputStyle} value={form.role} onChange={set("role")} />
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <label style={labelStyle}>ATS Platform</label>
              <select style={inputStyle} value={form.ats} onChange={set("ats")}>
                {ATS_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={set("status")}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Match Score (%)</label>
            <input style={inputStyle} type="number" min="0" max="100" value={form.matchScore} onChange={set("matchScore")} />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              style={{ ...inputStyle, height: 60, resize: "none", paddingTop: 8 }}
              value={form.notes}
              onChange={set("notes")}
            />
          </div>

          {error && <p style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#e24b4a" }}>{error}</p>}

          <div className="flex gap-2 mt-2">
            <button
              onClick={onClose}
              style={{ flex: 1, height: 36, borderRadius: 10, border: "1px solid #e0e0ea", background: "white", fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#6b7280", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                flex: 1, height: 36, borderRadius: 10, border: "none", background: "#5b3df5", color: "white",
                fontSize: 12, fontFamily: "Syne, sans-serif", fontWeight: 500,
                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditApplicationModal;