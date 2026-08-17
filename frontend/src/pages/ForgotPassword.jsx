import { useState } from "react";
import api from "../lib/axios.js";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const sendCode = async () => {
    if (!email.trim()) {
      setMsg("Please enter your email.");
      return;
    }
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await api.post("/auth/reset-password", { email, code, newPassword });
      setMsg(res.data.message);
      setTimeout(() => window.location.href = "/auth", 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f4ff" }}>
      <div className="bg-white rounded-2xl p-8" style={{ width: 380 }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, marginBottom: 16 }}>
          {step === 1 ? "Forgot password" : "Reset password"}
        </h2>
        {step === 1 ? (
          <>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", height: 36, marginBottom: 12, padding: "0 12px", border: "1px solid #e0e0ea", borderRadius: 8 }} />
            <button onClick={sendCode} style={{ width: "100%", height: 40, background: "#5b3df5", color: "white", border: "none", borderRadius: 10 }}>
              Send Code
            </button>
          </>
        ) : (
          <>
            <input placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)}
              style={{ width: "100%", height: 36, marginBottom: 12, padding: "0 12px", border: "1px solid #e0e0ea", borderRadius: 8 }} />
            <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%", height: 36, marginBottom: 12, padding: "0 12px", border: "1px solid #e0e0ea", borderRadius: 8 }} />
            <button onClick={resetPassword} style={{ width: "100%", height: 40, background: "#5b3df5", color: "white", border: "none", borderRadius: 10 }}>
              Reset Password
            </button>
          </>
        )}
        {msg && <p style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>{msg}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;