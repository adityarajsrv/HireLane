/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function TypeLine({
  text,
  delay = 0,
  color = "text-zinc-300",
  onDone,
  active,
}) {
  const [shown, setShown] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay, active]);

  useEffect(() => {
    if (!started) return;

    if (shown.length >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => {
      setShown(text.slice(0, shown.length + 1));
    }, 18);
    return () => clearTimeout(t);
  }, [started, shown, text]);

  return (
    <span className={`${color} font-mono text-[13px] leading-6 block`}>
      {shown}
      {shown.length < text.length && started && (
        <span className="inline-block w-1.75 h-3.25 bg-emerald-400 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

function TerminalBlock({ cmd, lines, startDelay = 0, active }) {
  const [phase, setPhase] = useState("waiting");
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!active) return;

    const t = setTimeout(() => {
      setPhase("cmd");
    }, startDelay);
    return () => clearTimeout(t);
  }, [active, startDelay]);

  const onCmdDone = () => {
    setTimeout(() => {
      setPhase("lines");
      setVisibleLines(1);
    }, 200);
  };

  useEffect(() => {
    if (phase !== "lines") return;
    if (visibleLines >= lines.length) return;
    const t = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, 320);

    return () => clearTimeout(t);
  }, [phase, visibleLines, lines.length]);

  return (
    <div
      className={`
        transition-all duration-500
        ${
          phase === "waiting"
            ? "opacity-30 translate-y-2"
            : "opacity-100 translate-y-0"
        }
      `}
    >
      <div className="flex items-start gap-2 mb-1">
        <span className="text-emerald-400 font-mono text-[13px] mt-0.5 select-none">
          ›
        </span>
        {phase !== "waiting" ? (
          <TypeLine
            text={cmd}
            delay={0}
            color="text-white"
            onDone={onCmdDone}
            active={active}
          />
        ) : (
          <span className="text-zinc-600 font-mono text-[13px]">{cmd}</span>
        )}
      </div>
      {phase === "lines" && (
        <div className="ml-4 flex flex-col gap-0.5 mb-1">
          {lines.slice(0, visibleLines).map((l, i) => (
            <div
              key={i}
              className="flex items-start gap-2 animate-[fadeIn_.35s_ease]"
            >
              <span className="text-emerald-500 text-[11px] mt-0.75 select-none">
                ✓
              </span>
              <span className="font-mono text-[12.5px] text-zinc-400 leading-5">
                <span className="text-zinc-300">{l.key}</span>
                {l.val && <span className="text-zinc-500">{l.val}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const BLOCKS = [
  {
    cmd: `parse_jd("https://stripe.com/jobs/4521")`,
    lines: [
      { key: "role:", val: `  Software Engineer, Connect` },
      {
        key: "must:",
        val: `  ["typescript", "postgres", "distributed systems"]`,
      },
      { key: "nice:", val: `  ["go", "kafka"]` },
    ],
  },
  {
    cmd: "match_profile(aarav.json)",
    lines: [
      { key: "overlap:", val: "   87%" },
      { key: "highlight:", val: ` ["upi-2.0", "kyc-pipeline"]` },
    ],
  },
  {
    cmd: "tailor_resume()",
    lines: [
      { key: `moved `, val: `"Razorpay UPI" → top` },
      { key: "rewrote bullets in active voice" },
      { key: "confidence:", val: " 0.94" },
    ],
  },
];

function Terminal({ active }) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-700/60 shadow-[0_32px_80px_-12px_rgba(0,0,0,.7)] w-full max-w-135">
      <div className="bg-zinc-800 flex items-center gap-2 px-4 py-3 border-b border-zinc-700/50">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="text-zinc-500 text-[12px] font-mono ml-2 tracking-wide">
          hirelane - match.ts
        </span>
      </div>
      <div className="bg-[#161616] px-5 py-5 flex flex-col gap-4 min-h-70">
        {BLOCKS.map((b, i) => (
          <TerminalBlock
            key={i}
            cmd={b.cmd}
            lines={b.lines}
            startDelay={i * 1800}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}

function Bullet({ icon, title, desc, delay, active }) {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (!active) return;

    const t = setTimeout(() => setVis(true), delay);

    return () => clearTimeout(t);
  }, [delay, active]);

  return (
    <div
      className={`
        flex items-start gap-3 transition-all duration-700
        ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
    >
      <span className="mt-0.5 text-emerald-400 text-[15px] select-none">
        {icon}
      </span>
      <p className="text-[14px] text-zinc-400 leading-relaxed">
        <span className="text-zinc-200 font-medium">{title}</span>
        {desc && <span className="text-zinc-500"> - {desc}</span>}
      </p>
    </div>
  );
}

const AI = () => {
  const [sectionRef, inView] = useInView(0.35);
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const frame = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cancelAnimationFrame(frame.current);

    frame.current = requestAnimationFrame(() => {
      setMouse({ x, y });
    });
  };
  const handleMouseLeave = () => setMouse({ x: -999, y: -999 });
  useEffect(() => {
    return () => cancelAnimationFrame(frame.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-[#0a0a0a] h-150 px-12 py-20 flex items-center"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(91,61,245,0.12), transparent 38%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
            `,
            backgroundSize: "42px 42px",
            maskImage:
              "radial-gradient(circle at center, black 45%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 45%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundImage: `
      linear-gradient(to right, rgba(91,61,245,0.9) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(91,61,245,0.9) 1px, transparent 1px)
    `,
            backgroundSize: "56px 56px",
            opacity: mouse.x === -999 ? 0 : 0.22,
            transform: "translateZ(0)",
            willChange: "mask-image, -webkit-mask-image",
            WebkitMaskImage: `
      radial-gradient(
        circle 240px at ${mouse.x}px ${mouse.y}px,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.9) 35%,
        rgba(0,0,0,0.45) 60%,
        transparent 100%
      )
    `,
            maskImage: `
      radial-gradient(
        circle 240px at ${mouse.x}px ${mouse.y}px,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.9) 35%,
        rgba(0,0,0,0.45) 60%,
        transparent 100%
      )
    `,
          }}
        />
      </div>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div
          className={`
            transition-all duration-1000
            ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <p className="text-[10.5px] font-semibold tracking-[.16em] uppercase text-emerald-500 mb-5">
            The Model
          </p>
          <h2 className="text-[clamp(2.4rem,4vw,3.8rem)] font-black leading-[1.07] tracking-tight text-white mb-6">
            Not another{" "}
            <em className="font-['Instrument_Serif'] italic font-normal">
              AI wrapper.
            </em>
          </h2>
          <p className="text-[15px] text-zinc-400 leading-relaxed max-w-105 mb-10">
            We trained HireLane around job applications specifically - field
            mapping, ATS quirks, recruiter patterns, resume structure, the
            works.
          </p>
          <div className="flex flex-col gap-4">
            <Bullet
              icon="·"
              title="JD parsing"
              desc="extracts must-haves vs nice-to-haves"
              delay={200}
              active={inView}
            />
            <Bullet
              icon="·"
              title="Semantic matching"
              desc="your projects ⇌ their stack"
              delay={420}
              active={inView}
            />
            <Bullet
              icon="·"
              title="Resume tailoring"
              desc="per role, automatically"
              delay={640}
              active={inView}
            />
            <Bullet
              icon="·"
              title="Autofill confidence"
              desc="flags weird fields before they break"
              delay={860}
              active={inView}
            />
          </div>
        </div>
        <div
          className={`
            flex justify-center lg:justify-end
            transition-all duration-1000 delay-200
            ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
          `}
        >
          <Terminal active={inView} />
        </div>
      </div>
    </section>
  );
};

export default AI;
