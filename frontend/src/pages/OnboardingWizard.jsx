import { useState } from "react";
import useProfile from "../hooks/useProfile.js";

const NOTICE_OPTIONS = ["Immediate", "15d", "30d", "60d", "90d"];
const WORK_AUTH_OPTIONS = [
  { value: "citizen",             label: "Citizen" },
  { value: "permanent_resident",  label: "Permanent Resident" },
  { value: "visa",                label: "Visa / Work Permit" },
  { value: "other",               label: "Other" },
];

const EEO_DEFAULT = "prefer_not_to_say";

const inputStyle = {
  height: 36, padding: "0 12px", border: "1px solid #e0e0ea", borderRadius: 8,
  fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#0a0a0f", width: "100%", outline: "none",
};
const labelStyle = { fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase", marginBottom: 4, display: "block" };

const OnboardingWizard = ({ onComplete }) => {
  const { updateProfile } = useProfile();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    workAuth: "citizen",
    noticePeriod: "30d",
    expectedSalary: 18,
    targetRoles: [],
    roleInput: "",
    gender: EEO_DEFAULT,
    ethnicity: EEO_DEFAULT,
    veteranStatus: EEO_DEFAULT,
    disabilityStatus: EEO_DEFAULT,
  });

  const NOTICE_TO_API = { "Immediate": "immediate", "15d": "15days", "30d": "30days", "60d": "60days", "90d": "90days" };

  const addRole = (e) => {
    if (e.key === "Enter" && form.roleInput.trim()) {
      setForm((p) => ({ ...p, targetRoles: [...p.targetRoles, p.roleInput.trim()], roleInput: "" }));
    }
  };
  const removeRole = (role) => setForm((p) => ({ ...p, targetRoles: p.targetRoles.filter((r) => r !== role) }));

  const handleFinish = async (skippedEEO = false) => {
    setSaving(true);
    try {
      await updateProfile({
        workAuth: form.workAuth,
        noticePeriod: NOTICE_TO_API[form.noticePeriod],
        expectedSalary: form.expectedSalary * 100000,
        targetRoles: form.targetRoles,
        gender: skippedEEO ? "" : form.gender,
        ethnicity: skippedEEO ? "" : form.ethnicity,
        veteranStatus: skippedEEO ? "" : form.veteranStatus,
        disabilityStatus: skippedEEO ? "" : form.disabilityStatus,
        onboardingCompleted: true,
      });
      onComplete();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f4ff" }}>
      <div className="bg-white rounded-2xl p-8" style={{ width: 480, border: "1px solid #f0f0f4" }}>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ height: 3, flex: 1, borderRadius: 2, background: s <= step ? "#5b3df5" : "#f0f0f4", transition: "background 200ms" }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 500, marginBottom: 4 }}>
              A few quick details
            </h2>
            <p style={{ fontSize: 12, color: "#9ca3af", fontFamily: "DM Sans, sans-serif", marginBottom: 20 }}>
              Workday and similar platforms ask for this on almost every application — set it once, autofill handles the rest.
            </p>

            <label style={labelStyle}>Work Authorization</label>
            <div className="flex flex-col gap-2 mb-4">
              {WORK_AUTH_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2" style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", cursor: "pointer" }}>
                  <input type="radio" name="workAuth" checked={form.workAuth === opt.value}
                    onChange={() => setForm((p) => ({ ...p, workAuth: opt.value }))} style={{ accentColor: "#5b3df5" }} />
                  {opt.label}
                </label>
              ))}
            </div>

            <label style={labelStyle}>Notice Period</label>
            <div className="flex p-0.5 rounded-xl mb-4" style={{ background: "#f5f4ff", border: "1px solid #e8e8f0" }}>
              {NOTICE_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setForm((p) => ({ ...p, noticePeriod: opt }))}
                  className="flex-1 text-center rounded-lg" style={{
                    height: 32, border: "none", fontSize: 12, fontFamily: "DM Sans, sans-serif", cursor: "pointer",
                    background: form.noticePeriod === opt ? "white" : "transparent",
                    color: form.noticePeriod === opt ? "#0a0a0f" : "#9ca3af",
                    boxShadow: form.noticePeriod === opt ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                  }}>
                  {opt}
                </button>
              ))}
            </div>

            <label style={labelStyle}>Expected Salary (LPA)</label>
            <input type="range" min={8} max={40} value={form.expectedSalary}
              onChange={(e) => setForm((p) => ({ ...p, expectedSalary: Number(e.target.value) }))}
              className="w-full" style={{ accentColor: "#5b3df5" }} />
            <div className="text-center" style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5", marginBottom: 20 }}>
              ₹{form.expectedSalary}L
            </div>

            <button onClick={() => setStep(2)} className="w-full rounded-xl text-white"
              style={{ height: 40, background: "#5b3df5", border: "none", fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500, cursor: "pointer" }}>
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 500, marginBottom: 4 }}>
              What roles are you targeting?
            </h2>
            <p style={{ fontSize: 12, color: "#9ca3af", fontFamily: "DM Sans, sans-serif", marginBottom: 20 }}>
              Helps HireLane surface better JD matches and cover letters.
            </p>

            <input
              value={form.roleInput}
              onChange={(e) => setForm((p) => ({ ...p, roleInput: e.target.value }))}
              onKeyDown={addRole}
              placeholder="Type a role and press Enter..."
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <div className="flex flex-wrap gap-1.5 mb-6">
              {form.targetRoles.map((role) => (
                <span key={role} className="flex items-center gap-1.5 rounded px-2 py-0.5"
                  style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: "#ede8ff", color: "#5b3df5" }}>
                  {role}
                  <button onClick={() => removeRole(role)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5b3df5" }}>×</button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 rounded-xl"
                style={{ height: 40, background: "white", border: "1px solid #e0e0ea", fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#6b7280", cursor: "pointer" }}>
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 rounded-xl text-white"
                style={{ height: 40, background: "#5b3df5", border: "none", fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500, cursor: "pointer" }}>
                Continue
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 500, marginBottom: 4 }}>
              Voluntary disclosures
            </h2>
            <p style={{ fontSize: 12, color: "#9ca3af", fontFamily: "DM Sans, sans-serif", marginBottom: 20 }}>
              Many applications ask these questions. Everything defaults to "prefer not to say" — you can change any of these, or skip entirely.
            </p>

            {[
              { key: "gender", label: "Gender" },
              { key: "ethnicity", label: "Ethnicity" },
              { key: "veteranStatus", label: "Veteran Status" },
              { key: "disabilityStatus", label: "Disability Status" },
            ].map(({ key, label }) => (
              <div key={key} className="mb-3">
                <label style={labelStyle}>{label}</label>
                <select
                  style={inputStyle}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="disclosed">I'll disclose this per-application</option>
                </select>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <button onClick={() => handleFinish(true)} disabled={saving} className="flex-1 rounded-xl"
                style={{ height: 40, background: "white", border: "1px solid #e0e0ea", fontSize: 13, fontFamily: "DM Sans, sans-serif", color: "#6b7280", cursor: "pointer" }}>
                Skip this step
              </button>
              <button onClick={() => handleFinish(false)} disabled={saving} className="flex-1 rounded-xl text-white"
                style={{ height: 40, background: "#5b3df5", border: "none", fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "Finish Setup"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;