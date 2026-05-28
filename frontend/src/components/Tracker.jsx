import { useEffect, useState, useRef } from "react";

const Logo = ({ name }) => {
  const colors = {
    Stripe: { bg: "#635BFF22", text: "#635BFF" },
    Atlassian: { bg: "#0052CC22", text: "#0052CC" },
    Cloudflare: { bg: "#F6821F22", text: "#F6821F" },
    Vercel: { bg: "#00000015", text: "#000000" },
    Notion: { bg: "#00000015", text: "#555555" },
    Linear: { bg: "#5E6AD222", text: "#5E6AD2" },
    Arc: { bg: "#FF634722", text: "#FF6347" },
    Google: { bg: "#EA433522", text: "#EA4335" },
    Figma: { bg: "#A259FF22", text: "#A259FF" },
  };

  const c = colors[name] || {
    bg: "#6366f122",
    text: "#6366f1",
  };

  return (
    <div
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
      style={{ background: c.bg, color: c.text }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};

const COLUMNS = [
  {
    id: "applied",
    title: "APPLIED",
    count: 132,
    accent: "text-gray-400",
    cards: [
      { id: "stripe", name: "Stripe", role: "SDE-II", salary: "₹58L" },
      { id: "atlassian", name: "Atlassian", role: "SDE-II", salary: "₹62L" },
      { id: "cloudflare", name: "Cloudflare", role: "SRE", salary: "₹66L" },
      { id: "meta", name: "Meta", role: "Frontend", salary: "₹74L" },
    ],
  },
  {
    id: "oa",
    title: "OA",
    count: 18,
    accent: "text-[#5b3df5]",
    cards: [
      { id: "vercel", name: "Vercel", role: "FE", salary: "₹52L" },
      { id: "notion", name: "Notion", role: "FS", salary: "₹60L" },
      { id: "airbnb", name: "Airbnb", role: "Platform", salary: "₹64L" },
    ],
  },
  {
    id: "interview",
    title: "INTERVIEW",
    count: 6,
    accent: "text-[#5b3df5]",
    cards: [
      { id: "linear", name: "Linear", role: "FS", salary: "₹72L" },
      { id: "arc", name: "Arc", role: "SDE", salary: "₹68L" },
      { id: "figma2", name: "Figma", role: "Frontend", salary: "₹78L" },
    ],
  },
  {
    id: "rejected",
    title: "REJECTED",
    count: 38,
    accent: "text-gray-400",
    cards: [
      { id: "google", name: "Google", role: "SDE-III", salary: "-" },
      { id: "uber", name: "Uber", role: "Backend", salary: "-" },
    ],
  },
  {
    id: "offer",
    title: "OFFER",
    count: 2,
    accent: "text-emerald-500",
    cards: [{ id: "figma", name: "Figma", role: "FE", salary: "₹78L" }],
  },
];

const BARS = [40, 68, 52, 96, 82, 24, 10];
const BAR_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const STATS = [
  {
    end: 18,
    suffix: " min",
    label: "saved per application",
    color: "text-[#5b3df5]",
  },
  {
    end: 5,
    suffix: "",
    label: "ATS platforms supported",
    color: "text-[#5b3df5]",
  },
  {
    end: 12000,
    suffix: "+",
    label: "applications filled",
    color: "text-[#5b3df5]",
  },
  {
    end: 93,
    suffix: "%",
    label: "autofill accuracy",
    color: "text-[#5b3df5]",
  },
];

function useCountUp(end, duration = 1800, start = false) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime = null;

    const raf = requestAnimationFrame(function step(ts) {
      if (!startTime) startTime = ts;

      const progress = Math.min((ts - startTime) / duration, 1);

      setVal(Math.floor(progress * end));

      if (progress < 1) requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(raf);
  }, [start, end, duration]);

  return val;
}

const StatCard = ({ end, suffix, label, color, statsVisible }) => {
  const val = useCountUp(end, 1600, statsVisible);

  const display = end >= 1000 ? val.toLocaleString() : val;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <p className={`text-[44px] font-black tracking-[-0.04em] ${color}`}>
        {display}
        {suffix}
      </p>

      <p className="mt-2 text-[14px] text-gray-500">{label}</p>
    </div>
  );
};

const MOVE_CYCLE = 4000;

export default function Tracker() {
  const [visible, setVisible] = useState(false);
  const [barsIn, setBarsIn] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [movingId, setMovingId] = useState(null);
  const [movedCards, setMovedCards] = useState([]);
  const [pulseCol, setPulseCol] = useState(null);

  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const cycleRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          setTimeout(() => setBarsIn(true), 400);
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) obs.observe(sectionRef.current);

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );

    if (statsRef.current) obs.observe(statsRef.current);

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const run = () => {
      setMovingId("vercel");
      setPulseCol("oa");

      setTimeout(() => {
        setMovedCards(["vercel"]);
        setMovingId(null);
        setPulseCol("interview");

        setTimeout(() => setPulseCol(null), 1000);
      }, 800);

      setTimeout(() => setMovedCards([]), MOVE_CYCLE - 300);
    };

    const t = setTimeout(run, 1500);
    cycleRef.current = setInterval(run, MOVE_CYCLE);

    return () => {
      clearTimeout(t);
      clearInterval(cycleRef.current);
    };
  }, []);

  const getCols = () =>
    COLUMNS.map((col) => {
      if (col.id === "oa") {
        return {
          ...col,
          cards: col.cards.filter((c) => !movedCards.includes(c.id)),
        };
      }
      if (col.id === "interview") {
        const extra = movedCards.includes("vercel")
          ? [
              {
                id: "vercel",
                name: "Vercel",
                role: "FE",
                salary: "₹52L",
                fresh: true,
              },
            ]
          : [];
        return {
          ...col,
          cards: [...extra, ...col.cards],
        };
      }
      return col;
    });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fafafa] py-28"
      id="tracker"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5b3df5]">
            Tracker
          </p>
          <h2 className="mt-5 text-[52px] font-black leading-[1.04] tracking-[-0.04em] text-gray-950">
            The tracker updates itself.{" "}
            <em className="font-['Instrument_Serif'] italic font-normal text-gray-300">
              finally.
            </em>
          </h2>
          <p className="mt-6 text-[18px] leading-[1.7] text-gray-500">
            No more Notion tables. No more forgetting where you applied. It just
            knows.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_310px]">
          <div className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_10px_50px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-[20px] font-black tracking-[-0.03em] text-gray-950">
                  Fall 2026 - Job hunt
                </p>
                <p className="mt-1 text-[12px] text-gray-400">
                  Synced across LinkedIn, Greenhouse & Lever
                </p>
              </div>
              <div className="rounded-full bg-[#f5f3ff] px-3 py-1 text-[11px] font-semibold text-[#5b3df5]">
                Live tracking
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {getCols().map((col) => (
                <div
                  key={col.id}
                  className={`min-h-85 rounded-2xl border p-4 transition-all duration-500 ${
                    pulseCol === col.id
                      ? "border-[#5b3df5]/40 bg-[#faf9ff] shadow-[0_0_0_3px_rgba(91,61,245,0.07)]"
                      : "border-gray-200 bg-[#fcfcfc]"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p
                      className={`text-[10px] font-bold tracking-[0.14em] ${col.accent}`}
                    >
                      {col.title}
                    </p>
                    <span className="text-[11px] font-semibold text-gray-400">
                      {col.count}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {col.cards.map((card, index) => {
                      const isMoving = movingId === card.id;
                      return (
                        <div
                          key={card.id}
                          className={`rounded-xl border bg-white px-3 py-3 transition-all duration-700 ${
                            isMoving
                              ? "border-[#5b3df5]/20 bg-[#faf9ff] opacity-70"
                              : card.fresh
                                ? "border-emerald-200 bg-emerald-50/70"
                                : card.id === "figma"
                                  ? "border-emerald-200 bg-emerald-50/40"
                                  : "border-gray-200"
                          }`}
                          style={{
                            opacity: visible ? 1 : 0,
                            transform: visible
                              ? "translateY(0px)"
                              : "translateY(18px)",
                            transitionDelay: `${120 + index * 70}ms`,
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <Logo name={card.name} />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] font-semibold text-gray-900">
                                {card.name}
                              </p>
                              <p className="mt-0.5 text-[10px] text-gray-400">
                                {card.role} · {card.salary}
                              </p>
                            </div>
                            {card.id === "linear" && (
                              <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-600">
                                TODAY
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-400">Conversion</span>
                      <span className="font-semibold text-gray-700">
                        {col.id === "offer"
                          ? "33%"
                          : col.id === "interview"
                            ? "18%"
                            : col.id === "oa"
                              ? "12%"
                              : "4%"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div
              className={`rounded-3xl border border-gray-200 bg-white p-5 transition-all duration-700 ${
                visible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-6 opacity-0"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5b3df5] opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5b3df5]" />
                </span>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5b3df5]">
                  Conversion Insight
                </p>
              </div>
              <p className="text-[14px] leading-[1.65] text-gray-700">
                Your Workday applications convert{" "}
                <span className="font-black text-gray-950">2.3× worse</span>{" "}
                than Greenhouse.
              </p>
            </div>
            <div
              className={`rounded-3xl border border-gray-200 bg-white p-5 transition-all duration-700 delay-150 ${
                visible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-6 opacity-0"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Interview Reminder
                </p>
              </div>
              <p className="text-[14px] leading-[1.65] text-gray-700">
                <span className="font-bold text-gray-950">Linear</span> - Round
                2 with Tuhin.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                  Synced to calendar
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-500">
                  Prep kit ready
                </span>
              </div>
            </div>
            <div
              className={`rounded-3xl border border-gray-200 bg-white p-5 transition-all duration-700 delay-300 ${
                visible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-6 opacity-0"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-gray-950">
                    This week
                  </p>
                  <p className="text-[11px] text-gray-400">Applications sent</p>
                </div>
                <div className="rounded-full bg-[#f5f3ff] px-2.5 py-1 text-[10px] font-semibold text-[#5b3df5]">
                  +18%
                </div>
              </div>
              <div className="mt-2 flex h-36 items-end gap-2 rounded-2xl bg-[#fafafa] px-3 pb-3 pt-6">
                {BARS.map((h, i) => (
                  <div
                    key={i}
                    className="group flex h-full flex-1 flex-col items-center justify-end"
                  >
                    <div className="mb-1 text-[9px] font-semibold text-gray-400 opacity-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                      {h}
                    </div>
                    <div
                      className="relative w-full rounded-t-[10px] transition-all duration-700 ease-out hover:opacity-90"
                      style={{
                        height: barsIn ? `${Math.max(h, 12)}%` : "8%",
                        transitionDelay: `${i * 80}ms`,
                        background:
                          "linear-gradient(to top, #5b3df5 0%, #7c6cff 55%, #a89cff 100%)",
                        boxShadow:
                          h > 70
                            ? "0 10px 25px rgba(91,61,245,0.28)"
                            : "0 4px 12px rgba(91,61,245,0.12)",
                      }}
                    >
                      <div className="absolute inset-x-0 top-0 h-3 rounded-full bg-white/30 blur-sm" />
                      <div className="absolute inset-0 overflow-hidden rounded-t-[10px]">
                        <div className="absolute inset-y-0 w-6 -translate-x-10 animate-[shine_2.8s_linear_infinite] bg-white/20 blur-md" />
                      </div>
                    </div>
                    <span className="mt-2 text-[10px] font-medium text-gray-400">
                      {BAR_LABELS[i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <p className="text-[11px] text-gray-400">
                  372 applications this month
                </p>
                <p className="text-[11px] font-semibold text-emerald-500">
                  Peak on Thursday
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={statsRef}
          className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} statsVisible={statsVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
