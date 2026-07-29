import { useState, useEffect } from "react";
import api from "../../lib/axios.js";

const ProfileCompletenessBanner = ({ onNavigate }) => {
  const [data, setData]       = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    api.get("/api/profile").then((res) => setData(res.data));
  }, []);

  if (!data || dismissed || data.completeness >= 90) return null;

  return (
    <div
      className="flex items-center justify-between rounded-2xl p-3 mb-4"
      style={{ background: "#faeeda", border: "1px solid #fde68a" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 32, height: 32, background: "#fde68a", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#854f0b", fontWeight: 600 }}
        >
          {data.completeness}%
        </div>
        <div>
          <div style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#854f0b" }}>
            Your profile is {data.completeness}% complete
          </div>
          {data.missingItems?.length > 0 && (
            <div style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#a16207" }}>
              Missing: {data.missingItems.join(", ")} — Workday and similar ATS platforms need this to autofill fully.
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onNavigate("profile")}
          style={{ height: 30, padding: "0 14px", background: "#854f0b", color: "white", border: "none", borderRadius: 8, fontSize: 11, fontFamily: "DM Sans, sans-serif", fontWeight: 500, cursor: "pointer" }}
        >
          Complete Profile
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: "none", border: "none", color: "#a16207", cursor: "pointer", fontSize: 16, padding: "0 4px" }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ProfileCompletenessBanner;