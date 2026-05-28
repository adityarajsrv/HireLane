/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from "react";

const steps = [
  {
    id: 1,
    title: "Upload your resume",
    description:
      "We parse skills, dates, projects, education and lock them into a smart profile. Edit anything in seconds.",
  },
  {
    id: 2,
    title: "Open any job page",
    description:
      "HireLane scans the form on the fly. Workday, Greenhouse, Lever, Naukri - fields get mapped instantly.",
  },
  {
    id: 3,
    title: "One click. Done.",
    description:
      "Fields fill, cover letter generates, submission tracked. You move on to the next role.",
  },
];

const TOTAL_STEPS = steps.length;

const Step1Card = ({ active }) => {
  const [visible, setVisible] = useState([]);

  const rows = [
    { label: "Name",       value: "Aarav Sharma" },
    { label: "Role",       value: "Software Engineer" },
    { label: "Experience", value: "Razorpay · 2022–Now" },
    { label: "Education",  value: "BITS Pilani · CS · 2018–22" },
  ];
  const skills = ["TypeScript", "Go", "PostgreSQL", "Kafka", "AWS", "Docker"];

  useEffect(() => {
    if (!active) { setVisible([]); return; }
    const all = [...rows.map((_, i) => i), ...skills.map((_, i) => rows.length + i)];
    all.forEach((id, seq) => setTimeout(() => setVisible(p => [...p, id]), 100 + seq * 100));
  }, [active]);

  return (
    <div className="flex h-full flex-col p-7 gap-5">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6L9 2z" stroke="#6b7280" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M9 2v4h4" stroke="#6b7280" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          <span className="text-[13px] text-gray-500">aarav_resume.pdf</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Parsed
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between py-1.5"
            style={{
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <span className="text-[12px] text-gray-400 w-24 shrink-0">{r.label}</span>
            <span className="text-[13px] font-medium text-gray-800">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4">
        <p className="text-[11px] text-gray-400 mb-3 uppercase tracking-widest">Skills</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span
              key={s}
              className="rounded-md border border-gray-200 px-2.5 py-1 text-[12px] text-gray-600"
              style={{
                opacity: visible.includes(rows.length + i) ? 1 : 0,
                transform: visible.includes(rows.length + i) ? "translateY(0)" : "translateY(4px)",
                transition: "opacity 0.25s ease, transform 0.25s ease",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Step2Card = ({ active }) => {
  const [mapped, setMapped] = useState([]);

  const fields = [
    { label: "Full name",     value: "Aarav Sharma" },
    { label: "Email",         value: "aarav@example.com" },
    { label: "Resume",        value: "aarav_resume.pdf" },
    { label: "Cover letter",  value: "Generated · tailored" },
    { label: "Notice period", value: "60 days" },
  ];

  useEffect(() => {
    if (!active) { setMapped([]); return; }
    fields.forEach((_, i) => setTimeout(() => setMapped(p => [...p, i]), 150 + i * 200));
  }, [active]);

  return (
    <div className="flex h-full flex-col p-7 gap-5">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-[13px] text-gray-500">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="#6b7280" strokeWidth="1.3"/>
            <path d="M7 1.5C7 1.5 9 4 9 7s-2 5.5-2 5.5M7 1.5C7 1.5 5 4 5 7s2 5.5 2 5.5M1.5 7h11" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          greenhouse.io/apply
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5b3df5]" />
          {mapped.length}/{fields.length} mapped
        </div>
      </div>
      <div className="h-0.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#5b3df5] rounded-full"
          style={{ width: `${(mapped.length / fields.length) * 100}%`, transition: "width 0.35s ease" }}
        />
      </div>
      <div className="space-y-1.5">
        {fields.map((f, i) => {
          const done = mapped.includes(i);
          return (
            <div
              key={f.label}
              className="flex items-center justify-between rounded-lg px-3.5 py-2.5 transition-colors duration-300"
              style={{ background: done ? "#f9f7ff" : "#fafafa" }}
            >
              <span className="text-[12px] text-gray-400 w-28 shrink-0">{f.label}</span>
              <span
                className="text-[13px] font-medium transition-all duration-300"
                style={{ color: done ? "#5b3df5" : "#d1d5db" }}
              >
                {done ? f.value : "-"}
              </span>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ opacity: done ? 1 : 0, transition: "opacity 0.2s ease" }}
              >
                <circle cx="7" cy="7" r="6" fill="#ede9fe"/>
                <path d="M4.5 7l2 2 3-3" stroke="#5b3df5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Step3Card = ({ active }) => {
  const [visibleRows, setVisibleRows] = useState([]);
  const [showInsight, setShowInsight] = useState(false);

  const apps = [
    { company: "Stripe",  role: "SDE-II",    ctc: "₹58L", status: "Applied",   },
    { company: "Vercel",  role: "Staff Eng.", ctc: "₹64L", status: "OA Sent",   },
    { company: "Linear",  role: "SDE-II",     ctc: "₹72L", status: "Interview", },
  ];

  useEffect(() => {
    if (!active) { setVisibleRows([]); setShowInsight(false); return; }
    apps.forEach((_, i) => setTimeout(() => setVisibleRows(p => [...p, i]), 100 + i * 160));
    setTimeout(() => setShowInsight(true), 100 + apps.length * 160 + 120);
  }, [active]);

  return (
    <div className="flex h-full flex-col p-7 gap-5">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <span className="text-[13px] text-gray-500">Applications</span>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          3 active
        </div>
      </div>
      <div className="flex items-center px-0.5">
        <span className="text-[11px] uppercase tracking-widest text-gray-300 flex-1">Company</span>
        <span className="text-[11px] uppercase tracking-widest text-gray-300 w-16 text-right">CTC</span>
        <span className="text-[11px] uppercase tracking-widest text-gray-300 w-20 text-right">Status</span>
      </div>
      <div className="space-y-1">
        {apps.map((a, i) => (
          <div
            key={a.company}
            className="flex items-center rounded-lg px-3 py-3 hover:bg-gray-50 transition-colors"
            style={{
              opacity: visibleRows.includes(i) ? 1 : 0,
              transform: visibleRows.includes(i) ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <div className="flex-1">
              <p className="text-[13px] font-medium text-gray-800">{a.company}</p>
              <p className="text-[11px] text-gray-400">{a.role}</p>
            </div>
            <span className="text-[13px] text-gray-500 w-16 text-right">{a.ctc}</span>
            <span className="text-[12px] text-gray-500 w-20 text-right">{a.status}</span>
          </div>
        ))}
      </div>
      <div
        className="mt-auto border-t border-gray-100 pt-4"
        style={{
          opacity: showInsight ? 1 : 0,
          transform: showInsight ? "translateY(0)" : "translateY(5px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        <p className="text-[12.5px] text-gray-400 leading-relaxed">
          Greenhouse converts <span className="text-gray-700 font-medium">2.3× better</span> than Workday for your profile.
        </p>
      </div>
    </div>
  );
};

const Working = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const sentinelRef = useRef(null);

  const onScroll = useCallback(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const raw = -el.getBoundingClientRect().top / (el.offsetHeight - window.innerHeight);
    if (raw < 0) { setActiveStep(1); setProgress(0); return; }
    if (raw >= 1) { setActiveStep(TOTAL_STEPS); setProgress(100); return; }
    const f = raw * TOTAL_STEPS;
    setActiveStep(Math.min(TOTAL_STEPS, Math.floor(f) + 1));
    setProgress((f / TOTAL_STEPS) * 100);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <>
      <style>{`
        .panel-t {
          transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1),
                      transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
      `}</style>
      <div ref={sentinelRef} style={{ height: `${(TOTAL_STEPS + 5) * 100}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden bg-[#fafafa]">
          <div className="flex h-full flex-col justify-center py-16 pt-20 pb-24 mt-5">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center mb-14">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5b3df5]">How it works</p>
                <h2 className="mt-4 text-5xl font-black tracking-[-0.04em] text-gray-950">
                  Three steps.<br /><span className="text-[#5b3df5] font-['Instrument_Serif'] italic font-normal">Zero friction.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">
                  From resume to applied in under a minute. HireLane removes repetitive job applications so you can focus on interviews.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-16 lg:grid-cols-[460px_1fr] items-center">
                <div className="relative h-100">
                  <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {[Step1Card, Step2Card, Step3Card].map((Panel, i) => {
                      const id = i + 1;
                      const active = activeStep === id;
                      const before = activeStep < id;
                      return (
                        <div
                          key={id}
                          className={`panel-t absolute inset-0 ${
                            active ? "opacity-100 translate-y-0 pointer-events-auto"
                            : before ? "opacity-0 translate-y-3 pointer-events-none"
                            : "opacity-0 -translate-y-3 pointer-events-none"
                          }`}
                        >
                          <Panel active={active} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-4.5 top-0 h-full w-px bg-gray-200" />
                  <div
                    className="absolute left-4.5 top-0 w-px bg-[#5b3df5] origin-top"
                    style={{ height: `${progress}%`, transition: "height 0.1s linear" }}
                  />
                  <div className="space-y-12">
                    {steps.map((step) => {
                      const active = activeStep === step.id;
                      const passed = activeStep > step.id;
                      return (
                        <div key={step.id} className="relative flex gap-8">
                          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                              active ? "bg-[#5b3df5] text-white scale-110 shadow-[0_0_0_4px_rgba(91,61,245,0.12)]"
                              : passed ? "bg-[#5b3df5]/10 text-[#5b3df5]"
                              : "bg-gray-100 text-gray-400"
                            }`}>
                              {passed ? (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M2.5 7L5.5 10L11.5 4" stroke="#5b3df5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              ) : step.id}
                            </div>
                          </div>
                          <div className={`max-w-xl pt-1 transition-all duration-500 ${active ? "opacity-100" : "opacity-25"}`}>
                            <h3 className={`text-3xl font-black tracking-tight transition-colors duration-200 ${active ? "text-gray-950" : "text-gray-400"}`}>
                              {step.title}
                            </h3>
                            <p className={`mt-3 text-lg leading-relaxed transition-colors duration-300 ${active ? "text-gray-600" : "text-gray-400"}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Working;