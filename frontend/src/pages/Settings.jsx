import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../lib/axios.js";

const Settings = () => {
  const { user, logout } = useAuth();
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: true });

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg({ text: "", ok: true }), 3000);
  };

  const handleLogoutAll = async () => {
    setLoggingOutAll(true);
    try {
      await api.post("/auth/logout-all");
      showMsg("Logged out from all devices.");
      setTimeout(() => logout(), 1000);
    } catch (err) {
      showMsg(err.response?.data?.message || "Failed to logout all devices.", false);
    } finally {
      setLoggingOutAll(false);
    }
  };

  const sectionStyle = { background: "white", border: "1px solid #f0f0f4", borderRadius: 16, padding: 20, marginBottom: 16 };
  const labelStyle   = { fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, display: "block" };

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
          Settings
        </h1>
        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>
          Account, plan, and session management
        </span>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>
            Account
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <label style={labelStyle}>Name</label>
              <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#0a0a0f" }}>{user?.name || "—"}</div>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#0a0a0f" }}>{user?.email || "—"}</div>
            </div>
            <div>
              <label style={labelStyle}>Plan</label>
              <div style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5", textTransform: "capitalize" }}>{user?.plan || "free"}</div>
            </div>
            <div>
              <label style={labelStyle}>Provider</label>
              <div style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#6b7280", textTransform: "capitalize" }}>{user?.provider || "email"}</div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
            Plan & Limits
          </div>
          <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#6b7280", marginBottom: 16 }}>
            Free plan: 20 tracked applications, 5 AI calls/day, 15 fills/month.
          </p>
          <button
            style={{ height: 36, padding: "0 20px", background: "#5b3df5", color: "white", border: "none", borderRadius: 10, fontSize: 12, fontFamily: "Syne, sans-serif", fontWeight: 500, cursor: "pointer" }}
          >
            Upgrade to Pro
          </button>
        </div>

        <div style={sectionStyle}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
            Sessions
          </div>
          <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#6b7280", marginBottom: 16 }}>
            Log out of HireLane on all devices, including this one.
          </p>
          {msg.text && (
            <p style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: msg.ok ? "#1bd29c" : "#e24b4a", marginBottom: 12 }}>
              {msg.text}
            </p>
          )}
          <button
            onClick={handleLogoutAll}
            disabled={loggingOutAll}
            style={{
              height: 36, padding: "0 20px", background: "white", color: "#e24b4a",
              border: "1px solid #fcebeb", borderRadius: 10, fontSize: 12,
              fontFamily: "DM Sans, sans-serif", fontWeight: 500,
              cursor: loggingOutAll ? "not-allowed" : "pointer",
            }}
          >
            {loggingOutAll ? "Logging out..." : "Logout of all devices"}
          </button>
        </div>
        <div style={{ ...sectionStyle, border: "1px solid #fcebeb" }}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#e24b4a", marginBottom: 4 }}>
            Danger Zone
          </div>
          <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#6b7280", marginBottom: 16 }}>
            Deleting your account is permanent and removes all applications, profile data, and resume history.
          </p>
          <button
            style={{ height: 36, padding: "0 20px", background: "white", color: "#e24b4a", border: "1px solid #e24b4a", borderRadius: 10, fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 500, cursor: "pointer" }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;