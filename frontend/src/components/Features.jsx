/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";

const useInterval = (cb, delay) => {
  const saved = useRef(cb);

  useEffect(() => {
    saved.current = cb;
  }, [cb]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

function Card({ children, className = "" }) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-[28px]
        border border-stone-200/90 bg-white p-6
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:scale-[1.01]
        hover:border-violet-400
        hover:shadow-[0_20px_60px_-12px_rgba(124,111,255,.16)]
        cursor-default
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-violet-200/30 blur-3xl" />
      </div>
      {children}
    </div>
  );
}

function Tag({ children }) {
  return (
    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 transition-colors duration-200 group-hover:text-violet-500">
      {children}
    </p>
  );
}

function CardTitle({ children }) {
  return (
    <h3 className="mb-1 text-[18px] font-bold leading-tight tracking-[-0.02em] text-gray-950">
      {children}
    </h3>
  );
}

function CardSub({ children }) {
  return (
    <p className="mb-5 text-[14px] leading-[1.7] font-normal text-gray-500">
      {children}
    </p>
  );
}

const COVER_PARAGRAPHS = [
  "Hi Linear team,\n\nI'm Aarav - shipped the Razorpay UPI 2.0 flow and cut p95 latency by 40%.\n\nYour issue triage UX is the cleanest I've seen.",

  "Hi Vercel team,\n\nI'm Priya - built the edge-rendering pipeline at Swiggy serving 12M RPS.\n\nYour DX philosophy aligns perfectly with how I build.",

  "Hi Notion team,\n\nI'm Dev - rewrote the offline-sync engine at Cred from scratch.\n\nYour block editor is a masterclass in collaborative UX.",
];

function CoverLetterCard() {
  const [paraIdx, setParaIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  const [blink, setBlink] = useState(true);
  const target = COVER_PARAGRAPHS[paraIdx];

  useEffect(() => {
    setDisplayed("");
    setCharIdx(0);
  }, [paraIdx]);

  useInterval(
    () => {
      if (charIdx < target.length) {
        setDisplayed(target.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else {
        setTimeout(
          () => setParaIdx((i) => (i + 1) % COVER_PARAGRAPHS.length),
          2000,
        );
      }
    },
    charIdx < target.length ? 28 : null,
  );

  useInterval(() => setBlink((b) => !b), 530);

  return (
    <Card className="col-span-1 md:col-span-6 xl:col-span-7 row-span-7">
      <Tag>✦ AI Cover Letters</Tag>
      <CardTitle>Don't sound like AI.</CardTitle>
      <CardSub>
        Trained on real recruiter responses. Pulls your actual projects, not
        generic fluff.
      </CardSub>
      <div className="min-h-41.25 whitespace-pre-wrap rounded-2xl border border-stone-200 bg-stone-50 p-4 font-mono text-[12.5px] leading-[1.8] text-stone-700">
        {displayed}
        <span
          className={`font-light text-violet-500 transition-opacity duration-75 ${
            blink ? "opacity-100" : "opacity-0"
          }`}
        >
          |
        </span>
        {charIdx >= target.length && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-400">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
            Generating next paragraph…
          </div>
        )}
      </div>
    </Card>
  );
}

const FIELDS = [
  { id: "name", label: "Name", x: 12, y: 12, w: 38, h: 18 },
  { id: "email", label: "Email", x: 54, y: 12, w: 38, h: 18 },
  { id: "phone", label: "Phone", x: 12, y: 38, w: 38, h: 18 },
  { id: "resume", label: "Resume", x: 54, y: 38, w: 38, h: 18 },
  { id: "linkedin", label: "LinkedIn", x: 12, y: 64, w: 80, h: 18 },
];

const EDGES = [
  ["name", "email"],
  ["name", "phone"],
  ["email", "resume"],
  ["phone", "linkedin"],
  ["resume", "linkedin"],
];

const fc = (f) => ({
  cx: f.x + f.w / 2,
  cy: f.y + f.h / 2,
});

function FormCard() {
  const [active, setActive] = useState(null);

  useInterval(() => {
    const id = FIELDS[Math.floor(Math.random() * FIELDS.length)].id;
    setActive(id);
    setTimeout(() => setActive(null), 700);
  }, 1200);

  return (
    <Card className="col-span-1 md:col-span-6 xl:col-span-5 row-span-7">
      <Tag>⬡ Smart Form Detection</Tag>

      <CardTitle>Bounding-box visual mapping.</CardTitle>

      <CardSub>Automatically detects and maps fields across any ATS.</CardSub>

      <svg viewBox="0 0 104 90" className="mt-2 w-full">
        {EDGES.map(([a, b]) => {
          const fa = FIELDS.find((f) => f.id === a);
          const fb = FIELDS.find((f) => f.id === b);
          const ca = fc(fa);
          const cb = fc(fb);
          const isLit = active === a || active === b;

          return (
            <line
              key={`${a}-${b}`}
              x1={ca.cx}
              y1={ca.cy}
              x2={cb.cx}
              y2={cb.cy}
              stroke={isLit ? "#7c6fff88" : "#7c6fff22"}
              strokeWidth="0.7"
              style={{ transition: "stroke .3s" }}
            />
          );
        })}
        {FIELDS.map((f) => (
          <g key={f.id}>
            <rect
              x={f.x}
              y={f.y}
              width={f.w}
              height={f.h}
              rx="2"
              fill={active === f.id ? "#7c6fff10" : "none"}
              stroke={active === f.id ? "#7c6fff" : "#c5c2dc"}
              strokeWidth="0.8"
              strokeDasharray={active === f.id ? "none" : "3 2"}
            />
            <text
              x={f.x + 2}
              y={f.y + 5.5}
              fill="#9a98b5"
              fontSize="3"
              fontFamily="monospace"
            >
              {f.label}
            </text>
            {active === f.id && (
              <circle cx={f.x + f.w - 3} cy={f.y + 3} r="1.5" fill="#7c6fff" />
            )}
          </g>
        ))}
      </svg>
    </Card>
  );
}

const NODES = [
  { id: "a", x: 50, y: 20 },
  { id: "b", x: 20, y: 55 },
  { id: "c", x: 80, y: 55 },
  { id: "d", x: 35, y: 80 },
  { id: "e", x: 65, y: 80 },
];

function CacheCard() {
  const [pulse, setPulse] = useState(null);

  useInterval(() => {
    const id = NODES[Math.floor(Math.random() * NODES.length)].id;
    setPulse(id);
    setTimeout(() => setPulse(null), 700);
  }, 900);

  return (
    <Card className="col-span-1 md:col-span-3 xl:col-span-4 row-span-6">
      <Tag>⬡ Shared AI Cache</Tag>
      <CardTitle>Community-powered mapping.</CardTitle>
      <CardSub>Field mappings improve every time someone applies.</CardSub>
      <div className="mt-2 flex flex-col items-center gap-4">
        <svg viewBox="0 0 100 100" className="w-full max-w-42.5">
          {NODES.map((n, i) =>
            NODES.slice(i + 1).map((m) => {
              const lit = pulse === n.id || pulse === m.id;
              return (
                <line
                  key={`${n.id}-${m.id}`}
                  x1={n.x}
                  y1={n.y}
                  x2={m.x}
                  y2={m.y}
                  stroke={lit ? "#7c6fff55" : "#7c6fff1a"}
                  strokeWidth="0.8"
                />
              );
            }),
          )}
          {NODES.map((n) => (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r="5"
              fill={pulse === n.id ? "#7c6fff" : "#ece9f8"}
              stroke={pulse === n.id ? "#7c6fff" : "#c5c2dc"}
              strokeWidth="0.8"
            />
          ))}
        </svg>
        <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-mono text-[10.5px] text-stone-400">
          ↑ mapped by community · 2.4k applies
        </span>
      </div>
    </Card>
  );
}

const PLATFORMS = [
  { name: "Greenhouse", conv: 34 },
  { name: "Lever", conv: 28 },
  { name: "Ashby", conv: 51 },
  { name: "Workday", conv: 19 },
];

function AnimatedBar({ pct, delay }) {
  const [w, setW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setW(pct), 300 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
      <div
        className="h-full rounded-full bg-linear-to-r from-violet-500 to-sky-400"
        style={{
          width: `${w}%`,
          transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
        }}
      />
    </div>
  );
}

function AnalyticsCard() {
  return (
    <Card className="col-span-1 md:col-span-3 xl:col-span-4 row-span-6">
      <Tag>◈ Analytics</Tag>
      <CardTitle>Platform effectiveness.</CardTitle>
      <CardSub>Know where to spend your next 300 applications.</CardSub>
      <div className="mb-5 flex flex-col gap-3">
        {PLATFORMS.map((p, i) => (
          <div
            key={p.name}
            className="grid grid-cols-[88px_1fr_36px] items-center gap-2.5"
          >
            <span className="font-mono text-[12px] text-stone-400">
              {p.name}
            </span>
            <AnimatedBar pct={p.conv} delay={i * 120} />
            <span className="text-right text-[11px] font-semibold text-stone-800">
              {p.conv}%
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[10.5px] text-emerald-600">
          ⬆ 34% avg. response rate
        </span>
        <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[10.5px] text-orange-500">
          ⬇ Workday: 19% - skip it
        </span>
      </div>
    </Card>
  );
}

const PROFILES = [
  {
    label: "SDE - backend",
    icon: "⚙",
    ring: "ring-violet-300",
    bg: "bg-violet-50",
    text: "text-violet-600",
    badge: "bg-violet-100 text-violet-600",
  },

  {
    label: "Founding eng",
    icon: "🚀",
    ring: "ring-sky-300",
    bg: "bg-sky-50",
    text: "text-sky-600",
    badge: "bg-sky-100 text-sky-600",
  },

  {
    label: "ML / research",
    icon: "◎",
    ring: "ring-rose-300",
    bg: "bg-rose-50",
    text: "text-rose-500",
    badge: "bg-rose-100 text-rose-500",
  },

  {
    label: "PM / growth",
    icon: "◈",
    ring: "ring-emerald-300",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-600",
  },
];

function ResumeCard() {
  const [active, setActive] = useState(0);

  useInterval(() => {
    setActive((a) => (a + 1) % PROFILES.length);
  }, 2200);

  return (
    <Card className="col-span-1 md:col-span-6 xl:col-span-4 row-span-6">
      <Tag>◈ Resume Profiles</Tag>
      <CardTitle>Role-targeted autofill.</CardTitle>
      <CardSub>Switch resumes per role - SDE, ML, PM, founding.</CardSub>
      <div className="flex flex-col gap-2">
        {PROFILES.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setActive(i)}
            className={`
              flex w-full items-center gap-2.5 rounded-xl border-[1.5px]
              px-3 py-2.5 text-left transition-all duration-200
              ${
                active === i
                  ? `border-current ring-1 ${p.ring} ${p.bg} ${p.text}`
                  : "border-transparent text-stone-600 hover:translate-x-1 hover:bg-stone-50"
              }
            `}
          >
            <span className="w-5 text-center text-sm">{p.icon}</span>
            <span className="flex-1 text-[13px] font-medium">{p.label}</span>
            {active === i && (
              <span
                className={`rounded px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${p.badge}`}
              >
                active
              </span>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
}

const Features = () => (
  <section className="bg-[#fafafa] py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mb-16">
        <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[.14em] text-violet-500">
          Features
        </p>
        <h2 className="text-[56px] font-black leading-[1.03] tracking-[-0.03em] text-gray-950">
          Built for people
        </h2>
        <h2 className="mt-2 text-[56px] font-black leading-[1.03] tracking-[-0.03em] text-[#5b3df5]">
          who actually{" "}
          <em className="font-['Instrument_Serif'] not-italic font-normal">
            apply.
          </em>
        </h2>
        <p className="mt-7 max-w-xl text-[17px] leading-[1.65] font-normal text-gray-500">
          Every detail tuned for the 50th, 100th, 300th application - not just
          the first.
        </p>
      </div>
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-6
          xl:grid-cols-12
          auto-rows-[52px]
          gap-4
        "
        style={{ gridAutoFlow: "dense" }}
      >
        <CoverLetterCard />
        <FormCard />
        <CacheCard />
        <AnalyticsCard />
        <ResumeCard />
      </div>
    </div>
  </section>
);

export default Features;
