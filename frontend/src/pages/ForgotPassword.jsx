import { useState } from "react";
import api from "../lib/axios.js";

const inputStyle = {
  width: "100%", height: 40, padding: "0 14px", border: "1px solid #e0e0ea",
  borderRadius: 10, fontSize: 13, fontFamily: "DM Sans, sans-serif",
  color: "#0a0a0f", outline: "none", boxSizing: "border-box", transition: "all 150ms",
};

const labelStyle = {
  fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af",
  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "block",
};

const focusHandlers = {
  onFocus: (e) => { e.target.style.borderColor = "#5b3df5"; e.target.style.boxShadow = "0 0 0 3px rgba(91,61,245,0.08)"; },
  onBlur:  (e) => { e.target.style.borderColor = "#e0e0ea"; e.target.style.boxShadow = "none"; },
};

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", ok: true });
  const [loading, setLoading] = useState(false);

  const showMsg = (text, ok = true) => setMsg({ text, ok });

  const sendCode = async () => {
    if (!email.trim()) return showMsg("Please enter your email.", false);
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      showMsg(res.data.message);
      setStep(2);
    } catch (err) {
      showMsg(err.response?.data?.message || "Something went wrong. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (code.length !== 6) return showMsg("Enter the 6-digit code.", false);
    if (newPassword.length < 8) return showMsg("Password must be at least 8 characters.", false);
    if (newPassword !== confirmPassword) return showMsg("Passwords do not match.", false);

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { email, code, newPassword });
      showMsg(res.data.message);
      setTimeout(() => (window.location.href = "/auth"), 1500);
    } catch (err) {
      showMsg(err.response?.data?.message || "Failed to reset password.", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f5f4ff" }}>
      <div
        className="bg-white rounded-2xl p-8"
        style={{ width: 400, border: "1px solid #f0f0f4", boxShadow: "0 8px 40px rgba(91,61,245,0.08)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, background: "#5b3df5" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 11L7 3L12 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 8H10" stroke="#1bd29c" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700 }}>
            <span style={{ color: "#1bd29c" }}>Hire</span><span style={{ color: "#5b3df5" }}>Lane</span>
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} style={{ height: 3, flex: 1, borderRadius: 2, background: s <= step ? "#5b3df5" : "#f0f0f4", transition: "background 200ms" }} />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
              Forgot your password?
            </h1>
            <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#9ca3af", marginBottom: 20 }}>
              Enter your email and we'll send you a 6-digit reset code.
            </p>

            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendCode()}
              style={{ ...inputStyle, marginBottom: 16 }}
              {...focusHandlers}
            />

            {msg.text && (
              <p style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: msg.ok ? "#1bd29c" : "#e24b4a", marginBottom: 14 }}>
                {msg.text}
              </p>
            )}

            <button
              onClick={sendCode}
              disabled={loading}
              className="w-full rounded-xl text-white"
              style={{
                height: 42, background: "#5b3df5", border: "none", fontSize: 13,
                fontFamily: "Syne, sans-serif", fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>

            <a href="/auth" style={{ display: "block", textAlign: "center", fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#9ca3af", marginTop: 16, textDecoration: "none" }}>
              ← Back to login
            </a>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
              Reset your password
            </h1>
            <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#9ca3af", marginBottom: 20 }}>
              Check <strong style={{ color: "#374151" }}>{email}</strong> for your code.
            </p>

            <label style={labelStyle}>6-digit code</label>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              style={{
                ...inputStyle, marginBottom: 14, textAlign: "center",
                fontSize: 20, letterSpacing: 6, fontFamily: "JetBrains Mono, monospace",
              }}
              {...focusHandlers}
            />

            <label style={labelStyle}>New password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ ...inputStyle, marginBottom: 14 }}
              {...focusHandlers}
            />

            <label style={labelStyle}>Confirm new password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && resetPassword()}
              style={{ ...inputStyle, marginBottom: 16 }}
              {...focusHandlers}
            />

            {msg.text && (
              <p style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: msg.ok ? "#1bd29c" : "#e24b4a", marginBottom: 14 }}>
                {msg.text}
              </p>
            )}

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full rounded-xl text-white"
              style={{
                height: 42, background: "#5b3df5", border: "none", fontSize: 13,
                fontFamily: "Syne, sans-serif", fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              onClick={() => setStep(1)}
              style={{
                display: "block", width: "100%", textAlign: "center", fontSize: 11,
                fontFamily: "DM Sans, sans-serif", color: "#9ca3af", marginTop: 16,
                background: "none", border: "none", cursor: "pointer",
              }}
            >
              ← Use a different email
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;