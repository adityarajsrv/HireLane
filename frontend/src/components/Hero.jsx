import { FaChrome } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const ALL_FIELDS = [
  { label: "Full name", value: "Aarav Sharma", col: "half" },
  { label: "Email", value: "aarav.sharma@gmail.com", col: "half" },
  { label: "Phone", value: "+91 98xxx 12345", col: "half" },
  { label: "LinkedIn", value: "linkedin.com/in/aaravs", col: "half" },
  { label: "Current company", value: "", col: "half" },
  { label: "Years of experience", value: "3", col: "half" },
];

const STEPS = [
  "Detect fields",
  "Map to profile",
  "Generate cover letter",
  "Submit & track",
];

const COVER_TEXT =
  "I'm excited to join your team. I've been building the Connect onboarding flow. I shipped a similar KYC pipeline that increased conversion by 41%. Would love a 20 min chat.";

const FIELD_DELAYS = [0, 800, 1600, 2400, 4200, 5000];
const STEP_DELAYS = [300, 1400, 2800, 5400];
const PROGRESS_STEPS = [
  { pct: 0, label: "0%", delay: 0 },
  { pct: 17, label: "17%", delay: 300 },
  { pct: 50, label: "50%", delay: 1400 },
  { pct: 67, label: "67%", delay: 2400 },
  { pct: 100, label: "100%", delay: 5400 },
];
const TOTAL_DURATION = 7500;

const TICKER_ITEMS = [
  "⚡ Autofill in 3 seconds",
  "✦ AI cover letters",
  "⬡ Smart ATS detection",
  "◎ Self-updating tracker",
  "✦ Resume profiles",
  "⚡ 12,000+ applications filled",
  "◈ Analytics insights",
  "⬡ Community field cache",
  "✦ Works on Workday · Greenhouse · Lever",
  "◎ 93% autofill accuracy",
];

export default function Hero() {
  const [filledCount, setFilledCount] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("0%");
  const [coverText, setCoverText] = useState("");
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const timers = useRef([]);
  const sectionEl = useRef(null);

  const clearAll = () => timers.current.forEach(clearTimeout);

  const runCycle = () => {
    clearAll();
    timers.current = [];
    setFilledCount(0);
    setCheckedSteps(0);
    setProgress(0);
    setProgressLabel("0%");
    setCoverText("");

    FIELD_DELAYS.forEach((delay, i) => {
      timers.current.push(setTimeout(() => setFilledCount(i + 1), delay));
    });
    STEP_DELAYS.forEach((delay, i) => {
      timers.current.push(setTimeout(() => setCheckedSteps(i + 1), delay));
    });
    PROGRESS_STEPS.forEach(({ pct, label, delay }) => {
      timers.current.push(
        setTimeout(() => {
          setProgress(pct);
          setProgressLabel(label);
        }, delay),
      );
    });

    const TYPING_START = 3200;
    COVER_TEXT.split("").forEach((_, i) => {
      timers.current.push(
        setTimeout(
          () => setCoverText(COVER_TEXT.slice(0, i + 1)),
          TYPING_START + i * 28,
        ),
      );
    });

    timers.current.push(setTimeout(runCycle, TOTAL_DURATION));
  };

  useEffect(() => {
    runCycle();
    return () => clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fieldFilled = (i) => i < filledCount;
  const stepDone = (i) => i < checkedSteps;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleMouseLeave = () => setMouse({ x: -999, y: -999 });

  return (
    <section
      ref={sectionEl}
      className="relative overflow-hidden bg-[#fafafa]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e8e8e8 1px, transparent 1px),
            linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          opacity: 0.55,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `
      linear-gradient(to right, #5b3df5 1px, transparent 1px),
      linear-gradient(to bottom, #5b3df5 1px, transparent 1px)
    `,
          backgroundSize: "56px 56px",
          opacity: mouse.x === -999 ? 0 : 0.35,
          WebkitMaskImage: `radial-gradient(circle 180px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(circle 180px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`,
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-between gap-12 px-6 pt-24 pb-16 lg:px-8">
        <div className="w-full max-w-130 shrink-0">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[13px] font-medium text-purple-700 tracking-wide">
              Automation for serious job seekers
            </span>
          </div>
          <h1 className="text-[56px] font-black leading-[1.03] tracking-[-0.03em] text-gray-950">
            Stop filling forms.
          </h1>
          <h1 className="mt-2 text-[56px] font-black leading-[1.03] tracking-[-0.03em] text-[#5b3df5]">
            Start getting{" "}
            <em className="font-['Instrument_Serif'] italic font-normal">
              hired.
            </em>
          </h1>
          <p className="mt-7 max-w-110 text-[17px] leading-[1.65] text-gray-500 font-normal">
            HireLane autofills every job application in few seconds with AI
            cover letters that actually sound like you, not LinkedIn cringe.
          </p>
          <div className="mt-9 flex items-center gap-7">
            <button className="cursor-pointer group flex items-center gap-2.5 rounded-2xl bg-[#5b3df5] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(91,61,245,0.35)] transition-all duration-200 hover:bg-[#4d34d4] hover:shadow-[0_6px_28px_rgba(91,61,245,0.45)] active:scale-[0.98]">
              <FaChrome
                size={17}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
              Add to Chrome - free
            </button>
            <button className="cursor-pointer flex items-center gap-1.5 text-[15px] font-medium text-gray-500 transition-colors hover:text-gray-900">
              See how it works
              <ChevronDown size={16} className="mt-px" />
            </button>
          </div>
          <div className="mt-11 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-gray-400">
            <span className="font-normal">Works on</span>
            {["Workday", "Greenhouse", "Lever", "Internshala", "Naukri"].map(
              (p, i, arr) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{p}</span>
                  {i < arr.length - 1 && (
                    <span className="text-gray-300">·</span>
                  )}
                </span>
              ),
            )}
          </div>
        </div>

        {/* ── RIGHT VISUAL ── */}
        <div
          className="relative hidden shrink-0 lg:block"
          style={{ width: 560 }}
        >
          {/* Main browser window */}
          <div className="w-full overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.09)]">
            {/* Title bar */}
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex flex-1 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12px] text-gray-400 shadow-sm border border-gray-100">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1a7 7 0 100 14A7 7 0 008 1z"
                    stroke="#9ca3af"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M5.5 8c0-2 1-4 2.5-5.5M10.5 8c0 2-1 4-2.5 5.5M1.5 8h13M2.5 5h11M2.5 11h11"
                    stroke="#9ca3af"
                    strokeWidth="1.2"
                  />
                </svg>
                workday.com/stripe/jobs/swe-platform/apply
              </div>
            </div>

            <div className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    WORKDAY · STRIPE
                  </p>
                  <p className="text-[15px] font-bold text-gray-900 leading-tight mt-0.5">
                    Software Engineer, Payments Platform
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-black text-[#5b3df5]">
                    {progressLabel}
                  </p>
                  <p className="text-[11px] text-gray-400">complete</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                {ALL_FIELDS.map((field, i) => (
                  <div key={field.label}>
                    <p className="mb-1 text-[11px] font-medium text-gray-500">
                      {field.label}
                    </p>
                    <div
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 transition-all duration-500
                        ${fieldFilled(i) ? "border-emerald-400 bg-white" : "border-gray-200 bg-gray-50"}`}
                    >
                      <span
                        className={`text-[13px] transition-all duration-300 ${fieldFilled(i) ? "text-gray-800" : "text-gray-300"}`}
                      >
                        {fieldFilled(i)
                          ? field.value || (
                              <span className="inline-flex gap-1">
                                <span className="h-2 w-14 rounded-full bg-gray-200 inline-block" />
                              </span>
                            )
                          : "-"}
                      </span>
                      {fieldFilled(i) && field.value && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="shrink-0 ml-2 animate-[fadeIn_0.3s_ease]"
                        >
                          <path
                            d="M3 8l4 4 6-6"
                            stroke="#22c55e"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full transition-colors duration-500 ${checkedSteps >= 4 ? "bg-emerald-500" : "bg-gray-200"}`}
                />
                <span
                  className={`text-[12px] font-medium transition-colors duration-500 ${checkedSteps >= 4 ? "text-emerald-600" : "text-gray-300"}`}
                >
                  Application tracked
                </span>
              </div>

              <div className="mt-3 min-h-13 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5">
                <p className="text-[12px] leading-relaxed text-gray-500">
                  {coverText}
                  {coverText.length > 0 &&
                    coverText.length < COVER_TEXT.length && (
                      <span className="ml-px inline-block h-3.5 w-0.5 animate-pulse bg-gray-400 align-middle" />
                    )}
                  {coverText.length === 0 && (
                    <span className="text-gray-300">
                      Cover letter generating...
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Floating — HireLane progress card */}
          <div className="absolute -right-6 top-10 w-65 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_16px_48px_rgba(0,0,0,0.11)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5b3df5] text-white text-sm font-bold shadow-[0_3px_10px_rgba(91,61,245,0.4)]">
                  HL
                </div>
                <p className="text-[16px] font-bold text-gray-900 leading-tight">
                  HireLane
                </p>
              </div>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="mb-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#5b3df5] transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2 text-[12px]">
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-400 ${stepDone(i) ? "bg-emerald-500" : "border border-gray-200 bg-white"}`}
                  >
                    {stepDone(i) && (
                      <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 8l4 4 6-6"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`transition-colors duration-300 font-medium ${stepDone(i) ? "text-gray-800" : "text-gray-300"}`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <button
              className={`mt-3.5 w-full rounded-xl py-2 text-[13px] font-semibold text-white transition-all duration-500 ${checkedSteps >= 4 ? "bg-[#5b3df5] shadow-[0_3px_12px_rgba(91,61,245,0.35)]" : "bg-gray-200 text-gray-400 cursor-default"}`}
            >
              {checkedSteps >= 4 ? "One-click apply" : "Processing…"}
            </button>
            {checkedSteps >= 3 && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="text-[#5b3df5]">+</span>
                <span>Cover letter generated</span>
              </div>
            )}
          </div>

          {/* Floating — saved time */}
          <div className="absolute -left-10 top-48 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.09)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v3.5l2 2"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Saved</p>
              <p className="text-[22px] font-bold leading-tight text-emerald-500">
                17 mins
              </p>
            </div>
          </div>

          {/* Floating — status */}
          <div className="absolute -left-14 bottom-16 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.09)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v3.5l2 2"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Status</p>
              <p className="text-[15px] font-bold text-gray-900 leading-tight">
                Application tracked
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <div className="relative z-10 border-t border-gray-200 bg-white/70 backdrop-blur-sm">
        <div className="overflow-hidden py-3">
          <div className="ticker flex w-max gap-10">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                className="shrink-0 text-[13px] font-medium text-gray-500 whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
