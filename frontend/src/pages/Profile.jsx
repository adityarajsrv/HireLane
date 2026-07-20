import { useState } from "react";

const NOTICE_OPTIONS = ["Immediate", "15d", "30d", "60d", "90d"];

const Profile = () => {
  const [noticePeriod,  setNoticePeriod ] = useState("30d");
  const [salary,        setSalary       ] = useState(18);
  const [targetRoles,   setTargetRoles  ] = useState(["Backend Engineer", "Full Stack SDE", "Platform Engineer"]);
  const [roleInput,     setRoleInput    ] = useState("");
  const [eeoToggle,     setEeoToggle    ] = useState(true);
  const [saving,        setSaving       ] = useState(false);

  const addRole = (e) => {
    if (e.key === "Enter" && roleInput.trim()) {
      setTargetRoles((prev) => [...prev, roleInput.trim()]);
      setRoleInput("");
    }
  };

  const removeRole = (role) => {
    setTargetRoles((prev) => prev.filter((r) => r !== role));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1400);
  };

  return (
    <div>
      <div className="mb-6">
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: "#0a0a0f",
            marginBottom: 4,
          }}
        >
          Profile
        </h1>
        <span
          style={{
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
            color: "#9ca3af",
          }}
        >
          Your intelligence base · autofill draws from here
        </span>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div
          className="bg-white rounded-2xl p-5 mb-4"
          style={{ border: "1px solid #f0f0f4" }}
        >
          <div
            className="mb-4"
            style={{
              fontSize: 14,
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              color: "#0a0a0f",
            }}
          >
            Resume Intelligence
          </div>
          <div
            className="flex items-center gap-3 p-3 rounded-xl mb-4"
            style={{ background: "#f5f4ff", border: "1px solid #ede8ff" }}
          >
            {/* File icon */}
            <div style={{ color: "#5b3df5" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="flex-1">
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#374151",
                }}
              >
                Aryan_Resume_2025.pdf
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#9ca3af",
                  marginTop: 2,
                }}
              >
                Uploaded Jun 3, 2025 · 847KB
              </div>
            </div>
            <button
              style={{
                fontSize: 10,
                fontFamily: "DM Sans, sans-serif",
                color: "#5b3df5",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Re-upload
            </button>
          </div>
          <div
            className="grid gap-x-6 gap-y-3 mb-4"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {[
              { label: "Current Role",     value: "Backend SDE"    },
              { label: "Experience",       value: "2.5 years"      },
              { label: "Current Employer", value: "Setu"           },
              { label: "Location",         value: "Bengaluru, IN"  },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  className="uppercase tracking-widest mb-1"
                  style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
                >
                  {label}
                </div>
                <div
                  style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#0a0a0f" }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <div
              className="uppercase tracking-widest mb-2"
              style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
            >
              Skills Detected
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["React", "Node.js", "MongoDB", "Express", "TypeScript", "Docker", "REST APIs", "Git", "PostgreSQL", "Redis"].map((s) => (
                <span
                  key={s}
                  className="rounded px-1.5 py-0.5"
                  style={{
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    background: "#f0f0f4",
                    color: "#6b7280",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div
              className="uppercase tracking-widest mb-2"
              style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
            >
              CV Bullets
            </div>
            <div className="flex flex-col gap-2">
              {[
                "Led migration of monolithic Node.js service to microservices, reducing p99 latency by 42%.",
                "Built a real-time analytics pipeline processing 1.2M events/day on MongoDB + Redis.",
                "Shipped payments module for Setu handling ₹4Cr+ in weekly transaction volume.",
                "Mentored 3 interns through onboarding, code review, and design ramp-up.",
                "Open-sourced 'fastfetch-node' — 800+ GitHub stars, used by 40+ companies.",
                "Bachelor's in CS, IIT Bombay (2023). CGPA 8.7/10.",
              ].map((bullet, i) => (
                <div
                  key={i}
                  className="flex gap-2 py-0.5"
                  style={{
                    borderLeft: "2px solid #ede8ff",
                    paddingLeft: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "DM Sans, sans-serif",
                      color: "#6b7280",
                      lineHeight: 1.6,
                    }}
                  >
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-2xl p-5 mb-4"
          style={{ border: "1px solid #f0f0f4" }}
        >
          <div
            className="mb-4"
            style={{
              fontSize: 14,
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              color: "#0a0a0f",
            }}
          >
            Personal Information
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {[
              { label: "FIRST NAME", defaultValue: "Aryan",                     half: true  },
              { label: "LAST NAME",  defaultValue: "Kumar",                      half: true  },
              { label: "PHONE",      defaultValue: "+91 98765 43210",             half: true  },
              { label: "EMAIL",      defaultValue: "aryan@gmail.com",             half: true  },
              { label: "LINKEDIN",   defaultValue: "linkedin.com/in/aryank",      half: false },
              { label: "GITHUB",     defaultValue: "github.com/aryank",           half: false },
              { label: "PORTFOLIO",  defaultValue: "aryan.dev",                   half: false },
              { label: "LOCATION",   defaultValue: "Bengaluru, India",            half: false },
            ].map(({ label, defaultValue, half }) => (
              <div
                key={label}
                style={{ gridColumn: half ? "span 1" : "span 2" }}
              >
                <label
                  className="block mb-1 uppercase tracking-widest"
                  style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
                >
                  {label}
                </label>
                <input
                  defaultValue={defaultValue}
                  className="w-full rounded-lg outline-none transition-all duration-150"
                  style={{
                    height: 36,
                    padding: "0 12px",
                    border: "1px solid #e0e0ea",
                    fontSize: 13,
                    fontFamily: "DM Sans, sans-serif",
                    color: "#0a0a0f",
                    background: "white",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#5b3df5";
                    e.target.style.boxShadow   = "0 0 0 3px rgba(91,61,245,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0ea";
                    e.target.style.boxShadow   = "none";
                  }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-5 rounded-xl text-white flex items-center justify-center gap-2 transition-opacity"
            style={{
              height: 40,
              background: "#5b3df5",
              border: "none",
              fontSize: 13,
              fontFamily: "Syne, sans-serif",
              fontWeight: 500,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid #f0f0f4" }}
        >
          <div
            className="mb-5"
            style={{
              fontSize: 14,
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              color: "#0a0a0f",
            }}
          >
            Work Preferences
          </div>
          <div className="mb-5">
            <label
              className="block mb-2 uppercase tracking-widest"
              style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
            >
              Notice Period
            </label>
            <div
              className="flex p-0.5 rounded-xl"
              style={{ background: "#f5f4ff", border: "1px solid #e8e8f0" }}
            >
              {NOTICE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setNoticePeriod(opt)}
                  className="flex-1 text-center rounded-lg transition-all duration-150"
                  style={{
                    height: 32,
                    border: "none",
                    fontSize: 12,
                    fontFamily: "DM Sans, sans-serif",
                    cursor: "pointer",
                    background: noticePeriod === opt ? "white" : "transparent",
                    color:      noticePeriod === opt ? "#0a0a0f" : "#9ca3af",
                    boxShadow:  noticePeriod === opt ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                    fontWeight: noticePeriod === opt ? 500 : 400,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <label
              className="block mb-2 uppercase tracking-widest"
              style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
            >
              Expected Salary (LPA)
            </label>
            <input
              type="range"
              min={8}
              max={40}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#5b3df5", cursor: "pointer" }}
            />
            <div className="flex justify-between items-center mt-1">
              <span
                style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
              >
                ₹8L
              </span>
              <span
                style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5" }}
              >
                ₹{salary}L
              </span>
              <span
                style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
              >
                ₹40L+
              </span>
            </div>
          </div>
          <div className="mb-5">
            <label
              className="block mb-2 uppercase tracking-widest"
              style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}
            >
              Target Roles
            </label>
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={addRole}
              placeholder="Type a role and press Enter..."
              className="w-full rounded-lg outline-none"
              style={{
                height: 36,
                padding: "0 12px",
                border: "1px solid #e0e0ea",
                fontSize: 12,
                fontFamily: "DM Sans, sans-serif",
                color: "#0a0a0f",
                marginBottom: 8,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#5b3df5";
                e.target.style.boxShadow   = "0 0 0 3px rgba(91,61,245,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0ea";
                e.target.style.boxShadow   = "none";
              }}
            />
            <div className="flex flex-wrap gap-1.5">
              {targetRoles.map((role) => (
                <span
                  key={role}
                  className="flex items-center gap-1.5 rounded px-2 py-0.5"
                  style={{
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    background: "#ede8ff",
                    color: "#5b3df5",
                  }}
                >
                  {role}
                  <button
                    onClick={() => removeRole(role)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#5b3df5",
                      padding: 0,
                      fontSize: 12,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "DM Sans, sans-serif",
                  color: "#374151",
                  marginBottom: 2,
                }}
              >
                Auto-select "Prefer not to say" on EEO fields
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "DM Sans, sans-serif",
                  color: "#9ca3af",
                }}
              >
                Applies to demographics questions
              </div>
            </div>
            <button
              onClick={() => setEeoToggle((v) => !v)}
              style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: eeoToggle ? "#5b3df5" : "#e0e0ea",
                position: "relative",
                transition: "background 200ms",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: eeoToggle ? 18 : 2,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 200ms",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;