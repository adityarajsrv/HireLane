import { useState, useEffect, useRef } from "react";
import useProfile from "../hooks/useProfile.js";

const NOTICE_OPTIONS = ["Immediate", "15d", "30d", "60d", "90d"];

const NOTICE_TO_API = {
  "Immediate": "immediate",
  "15d": "15days",
  "30d": "30days",
  "60d": "60days",
  "90d": "90days",
};

const API_TO_NOTICE = {
  "immediate": "Immediate",
  "15days": "15d",
  "30days": "30d",
  "60days": "60d",
  "90days": "90d",
};

const Profile = () => {
  const { profile, loading, error, updateProfile, uploadResume } = useProfile();

  const [formData, setFormData] = useState({
    firstName: "", lastName:  "", phone:     "",
    location:  "", linkedin:  "", github:    "", portfolio: "",
  });
  const [noticePeriod, setNoticePeriod] = useState("30d");
  const [salary,       setSalary      ] = useState(18);
  const [targetRoles,  setTargetRoles ] = useState([]);
  const [roleInput,    setRoleInput   ] = useState("");
  const [eeoToggle,    setEeoToggle   ] = useState(true);
  const [saving,       setSaving      ] = useState(false);
  const [uploading,    setUploading   ] = useState(false);
  const [msg,          setMsg         ] = useState({ text: "", ok: true });
  const fileRef = useRef(null);

  // Populate form when profile loads from backend
  useEffect(() => {
    if (!profile) return;
    setFormData({
      firstName: profile.firstName || "",
      lastName:  profile.lastName  || "",
      phone:     profile.phone     || "",
      location:  profile.location  || "",
      linkedin:  profile.linkedin  || "",
      github:    profile.github    || "",
      portfolio: profile.portfolio || "",
    });
    setTargetRoles(profile.targetRoles || []);
    setSalary(
      profile.expectedSalary
        ? Math.round(profile.expectedSalary / 100000)
        : 18
    );
    setNoticePeriod(
      API_TO_NOTICE[profile.noticePeriod] || "30d"
    );
  }, [profile]);

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg({ text: "", ok: true }), 3000);
  };

  const setField = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        ...formData,
        targetRoles,
        expectedSalary: salary * 100000,
        noticePeriod:   NOTICE_TO_API[noticePeriod],
      });
      showMsg("Changes saved successfully");
    } catch (err) {
      showMsg(err.response?.data?.message || "Save failed.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadResume(file);
      showMsg(`Resume parsed · ${res.extracted.skillsCount} skills · ${res.extracted.bulletsCount} bullets`);
    } catch (err) {
      showMsg(err.response?.data?.message || "Upload failed.", false);
    } finally {
      setUploading(false);
      e.target.value = ""; // reset file input so same file can be re-uploaded
    }
  };

  const addRole = (e) => {
    if (e.key === "Enter" && roleInput.trim()) {
      setTargetRoles((p) => [...p, roleInput.trim()]);
      setRoleInput("");
    }
  };

  const removeRole = (role) =>
    setTargetRoles((p) => p.filter((r) => r !== role));

  // ── Input styling helpers ─────────────────────────────────
  const inputStyle = {
    height: 36, padding: "0 12px",
    border: "1px solid #e0e0ea",
    borderRadius: 8,
    fontSize: 13, fontFamily: "DM Sans, sans-serif",
    color: "#0a0a0f", background: "white",
    outline: "none", width: "100%",
    boxSizing: "border-box",
  };
  const focusInput  = (e) => {
    e.target.style.borderColor = "#5b3df5";
    e.target.style.boxShadow   = "0 0 0 3px rgba(91,61,245,0.08)";
  };
  const blurInput   = (e) => {
    e.target.style.borderColor = "#e0e0ea";
    e.target.style.boxShadow   = "none";
  };
  const labelStyle  = {
    display: "block", marginBottom: 4,
    fontSize: 9, fontFamily: "JetBrains Mono, monospace",
    color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em",
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) return (
    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9ca3af", padding: 24 }}>
      Loading profile...
    </div>
  );

  if (error) return (
    <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#e24b4a", padding: 24 }}>
      {error}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
          Profile
        </h1>
        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>
          Your intelligence base · autofill draws from here
        </span>
      </div>

      <div style={{ maxWidth: 640 }}>

        {/* ── Section 1: Resume Intelligence ─────────────── */}
        <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>
            Resume Intelligence
          </div>

          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {profile?.resumeFileName ? (
            // Uploaded state
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
              style={{ background: "#f5f4ff", border: "1px solid #ede8ff" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b3df5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <div className="flex-1">
                <div style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#374151" }}>
                  {profile.resumeFileName}
                </div>
                <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", marginTop: 2 }}>
                  {profile.resumeUploadedAt
                    ? `Uploaded ${new Date(profile.resumeUploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "Recently uploaded"}
                </div>
              </div>
              <button
                onClick={() => fileRef.current.click()}
                disabled={uploading}
                style={{ fontSize: 10, fontFamily: "DM Sans, sans-serif", color: "#5b3df5", background: "none", border: "none", cursor: "pointer" }}
              >
                {uploading ? "Uploading..." : "Re-upload"}
              </button>
            </div>
          ) : (
            // Upload zone — no resume yet
            <div
              onClick={() => fileRef.current.click()}
              className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-colors duration-150 mb-4"
              style={{
                height: 96, border: "1.5px dashed #e0e0ea",
                background: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#5b3df5";
                e.currentTarget.style.background  = "#f5f4ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e0e0ea";
                e.currentTarget.style.background  = "white";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <span style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#9ca3af" }}>
                {uploading ? "Uploading and parsing..." : "Upload resume PDF"}
              </span>
              <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#b0b0c0", marginTop: 4 }}>
                Max 5MB · Text-based PDF only
              </span>
            </div>
          )}

          {/* Extracted data — only show if profile has data */}
          {profile?.skills?.length > 0 && (
            <>
              <div className="grid gap-x-6 gap-y-3 mb-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {[
                  { label: "First Name", value: profile.firstName },
                  { label: "Last Name",  value: profile.lastName  },
                  { label: "Phone",      value: profile.phone     },
                  { label: "Location",   value: profile.location  },
                ].filter(({ value }) => value).map(({ label, value }) => (
                  <div key={label}>
                    <div style={labelStyle}>{label}</div>
                    <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#0a0a0f" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div style={labelStyle}>Skills Detected</div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span key={s} className="rounded px-1.5 py-0.5"
                      style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: "#f0f0f4", color: "#6b7280" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* CV Bullets */}
              {profile.cvBullets?.length > 0 && (
                <div>
                  <div style={labelStyle}>CV Bullets</div>
                  <div className="flex flex-col gap-2">
                    {profile.cvBullets.map((bullet, i) => (
                      <div key={i} style={{ borderLeft: "2px solid #ede8ff", paddingLeft: 8 }}>
                        <span style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#6b7280", lineHeight: 1.6 }}>
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Section 2: Personal Information ────────────── */}
        <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>
            Personal Information
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>

            {/* Half-width fields */}
            {[
              { label: "First Name", key: "firstName" },
              { label: "Last Name",  key: "lastName"  },
              { label: "Phone",      key: "phone"     },
            ].map(({ label, key }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={inputStyle}
                  value={formData[key]}
                  onChange={setField(key)}
                  placeholder={label}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            ))}

            {/* Empty cell to maintain grid */}
            <div />

            {/* Full-width fields */}
            {[
              { label: "LinkedIn",  key: "linkedin"  },
              { label: "GitHub",    key: "github"    },
              { label: "Portfolio", key: "portfolio" },
              { label: "Location",  key: "location"  },
            ].map(({ label, key }) => (
              <div key={key} style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={inputStyle}
                  value={formData[key]}
                  onChange={setField(key)}
                  placeholder={label}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            ))}
          </div>

          {/* Message */}
          {msg.text && (
            <p style={{
              marginTop: 12, fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: msg.ok ? "#1bd29c" : "#e24b4a",
            }}>
              {msg.text}
            </p>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 rounded-xl text-white flex items-center justify-center gap-2"
            style={{
              height: 40, background: "#5b3df5", border: "none",
              fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500,
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
            ) : "Save Changes"}
          </button>
        </div>

        {/* ── Section 3: Work Preferences ────────────────── */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 20 }}>
            Work Preferences
          </div>

          {/* Notice period */}
          <div className="mb-5">
            <label style={labelStyle}>Notice Period</label>
            <div className="flex p-0.5 rounded-xl" style={{ background: "#f5f4ff", border: "1px solid #e8e8f0" }}>
              {NOTICE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setNoticePeriod(opt)}
                  className="flex-1 text-center rounded-lg transition-all duration-150"
                  style={{
                    height: 32, border: "none",
                    fontSize: 12, fontFamily: "DM Sans, sans-serif",
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

          {/* Salary slider */}
          <div className="mb-5">
            <label style={labelStyle}>Expected Salary (LPA)</label>
            <input
              type="range" min={8} max={40} value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full" style={{ accentColor: "#5b3df5", cursor: "pointer" }}
            />
            <div className="flex justify-between items-center mt-1">
              <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>₹8L</span>
              <span style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5" }}>₹{salary}L</span>
              <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>₹40L+</span>
            </div>
          </div>

          {/* Target roles */}
          <div className="mb-5">
            <label style={labelStyle}>Target Roles</label>
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={addRole}
              placeholder="Type a role and press Enter..."
              style={{ ...inputStyle, marginBottom: 8 }}
              onFocus={focusInput}
              onBlur={blurInput}
            />
            <div className="flex flex-wrap gap-1.5">
              {targetRoles.map((role) => (
                <span key={role} className="flex items-center gap-1.5 rounded px-2 py-0.5"
                  style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: "#ede8ff", color: "#5b3df5" }}
                >
                  {role}
                  <button
                    onClick={() => removeRole(role)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#5b3df5", padding: 0, fontSize: 12, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* EEO toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#374151", marginBottom: 2 }}>
                Auto-select "Prefer not to say" on EEO fields
              </div>
              <div style={{ fontSize: 10, fontFamily: "DM Sans, sans-serif", color: "#9ca3af" }}>
                Applies to demographics questions
              </div>
            </div>
            <button
              onClick={() => setEeoToggle((v) => !v)}
              style={{
                width: 36, height: 20, borderRadius: 10,
                border: "none", cursor: "pointer",
                background: eeoToggle ? "#5b3df5" : "#e0e0ea",
                position: "relative", transition: "background 200ms", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 2,
                left: eeoToggle ? 18 : 2,
                width: 16, height: 16, borderRadius: "50%",
                background: "white", transition: "left 200ms",
              }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;