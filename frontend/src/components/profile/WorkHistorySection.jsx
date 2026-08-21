import { useState } from "react";

const emptyJob = { company: "", title: "", startDate: "", endDate: "", description: "" };
const emptyEdu = { school: "", degree: "", fieldOfStudy: "", graduationYear: "", gpa: "" };

const inputStyle = {
  height: 32, padding: "0 10px", border: "1px solid #e0e0ea", borderRadius: 8,
  fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#0a0a0f", width: "100%", outline: "none",
};
const labelStyle = { fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af", textTransform: "uppercase", marginBottom: 3, display: "block" };

const WorkHistorySection = ({ workExperience, education, onSave }) => {
  const [jobs, setJobs] = useState(workExperience?.length ? workExperience : [emptyJob]);
  const [edus, setEdus] = useState(education?.length ? education : [emptyEdu]);
  const [saving, setSaving] = useState(false);

  const updateJob = (i, key, value) =>
    setJobs((prev) => prev.map((j, idx) => idx === i ? { ...j, [key]: value } : j));
  const updateEdu = (i, key, value) =>
    setEdus((prev) => prev.map((e, idx) => idx === i ? { ...e, [key]: value } : e));

  const addJob = () => setJobs((prev) => [...prev, { ...emptyJob }]);
  const addEdu = () => setEdus((prev) => [...prev, { ...emptyEdu }]);
  const removeJob = (i) => setJobs((prev) => prev.filter((_, idx) => idx !== i));
  const removeEdu = (i) => setEdus((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
    const cleanJobs = jobs.filter((j) => j.company || j.title);
      const cleanEdus = edus.filter((e) => e.school || e.degree);
      await onSave({ workExperience: cleanJobs, education: cleanEdus });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid #f0f0f4" }}>
      <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
        Work Experience &amp; Education
      </div>
      <p style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#9ca3af", marginBottom: 16 }}>
        Workday and similar platforms ask for this directly — keeping it accurate here means the extension can fill it automatically.
      </p>

      {/* Work Experience */}
      <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5", textTransform: "uppercase", marginBottom: 8 }}>
        Work Experience
      </div>
      {jobs.map((job, i) => (
        <div key={i} className="rounded-xl p-3 mb-3" style={{ background: "#fafafa", border: "1px solid #f0f0f4" }}>
          <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div><label style={labelStyle}>Company</label><input style={inputStyle} value={job.company} onChange={(e) => updateJob(i, "company", e.target.value)} /></div>
            <div><label style={labelStyle}>Title</label><input style={inputStyle} value={job.title} onChange={(e) => updateJob(i, "title", e.target.value)} /></div>
          </div>
          <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div><label style={labelStyle}>Start (YYYY-MM)</label><input style={inputStyle} value={job.startDate} onChange={(e) => updateJob(i, "startDate", e.target.value)} placeholder="2022-01" /></div>
            <div><label style={labelStyle}>End (blank = present)</label><input style={inputStyle} value={job.endDate} onChange={(e) => updateJob(i, "endDate", e.target.value)} placeholder="2024-06" /></div>
          </div>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, height: 50, resize: "none", paddingTop: 6 }}
            value={job.description}
            onChange={(e) => updateJob(i, "description", e.target.value)}
          />
          {jobs.length > 1 && (
            <button onClick={() => removeJob(i)} style={{ marginTop: 6, fontSize: 10, color: "#e24b4a", background: "none", border: "none", cursor: "pointer" }}>
              Remove entry
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addJob}
        style={{ fontSize: 11, color: "#5b3df5", background: "none", border: "1px dashed #ede8ff", borderRadius: 8, padding: "6px 12px", cursor: "pointer", marginBottom: 20 }}
      >
        + Add another job
      </button>

      {/* Education */}
      <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#5b3df5", textTransform: "uppercase", marginBottom: 8 }}>
        Education
      </div>
      {edus.map((edu, i) => (
        <div key={i} className="rounded-xl p-3 mb-3" style={{ background: "#fafafa", border: "1px solid #f0f0f4" }}>
          <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div><label style={labelStyle}>School</label><input style={inputStyle} value={edu.school} onChange={(e) => updateEdu(i, "school", e.target.value)} /></div>
            <div><label style={labelStyle}>Degree</label><input style={inputStyle} value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} /></div>
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div><label style={labelStyle}>Field of Study</label><input style={inputStyle} value={edu.fieldOfStudy} onChange={(e) => updateEdu(i, "fieldOfStudy", e.target.value)} /></div>
            <div><label style={labelStyle}>Grad Year</label><input style={inputStyle} value={edu.graduationYear} onChange={(e) => updateEdu(i, "graduationYear", e.target.value)} /></div>
            <div><label style={labelStyle}>GPA</label><input style={inputStyle} value={edu.gpa} onChange={(e) => updateEdu(i, "gpa", e.target.value)} /></div>
          </div>
          {edus.length > 1 && (
            <button onClick={() => removeEdu(i)} style={{ marginTop: 6, fontSize: 10, color: "#e24b4a", background: "none", border: "none", cursor: "pointer" }}>
              Remove entry
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addEdu}
        style={{ fontSize: 11, color: "#5b3df5", background: "none", border: "1px dashed #ede8ff", borderRadius: 8, padding: "6px 12px", cursor: "pointer", marginBottom: 16 }}
      >
        + Add another degree
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl text-white"
        style={{ height: 38, background: "#5b3df5", border: "none", fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
      >
        {saving ? "Saving..." : "Save Work History"}
      </button>
    </div>
  );
};

export default WorkHistorySection;