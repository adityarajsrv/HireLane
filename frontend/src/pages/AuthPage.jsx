import { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  Circle,
  ArrowRight,
  User,
  Zap,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";
import logo from "../assets/logo.png";

const AnimatedBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId,
      t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // ── Field labels drifting across bg
    const FIELD_LABELS = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "LinkedIn",
      "GitHub",
      "Experience",
      "Skills",
      "Location",
      "Salary",
      "Notice Period",
      "Resume",
      "Work Auth",
      "Portfolio",
      "Cover Letter",
    ];
    const floaters = FIELD_LABELS.map((text) => ({
      text,
      x: Math.random() * 1400,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.14,
      alpha: 0.04 + Math.random() * 0.07,
      phase: Math.random() * Math.PI * 2,
      filled: Math.random() > 0.38,
      size: 9 + Math.random() * 2,
    }));

    // ── Connection nodes (cache layer metaphor)
    const nodes = Array.from({ length: 22 }, (_, i) => ({
      x: Math.random() * 1400,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 1.5 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
      color: ["91,61,245", "27,210,156", "127,119,221"][i % 3],
    }));

    // ── ATS form mockup cards (static, subtle)
    const cards = [
      { x: 0.08, y: 0.12, w: 160, h: 90, label: "Greenhouse", fields: 3 },
      { x: 0.78, y: 0.08, w: 160, h: 90, label: "Workday", fields: 5 },
      { x: 0.04, y: 0.72, w: 160, h: 90, label: "Lever", fields: 4 },
      { x: 0.82, y: 0.74, w: 160, h: 90, label: "Internshala", fields: 3 },
    ];

    // ── Travelling data packets along node edges
    const packets = Array.from({ length: 8 }, () => ({
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      fromIdx: Math.floor(Math.random() * 22),
      toIdx: Math.floor(Math.random() * 22),
      color: Math.random() > 0.5 ? "91,61,245" : "27,210,156",
    }));

    const drawRoundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const draw = () => {
      const w = W(),
        h = H();
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(91,61,245,0.045)";
      const gs = 52;
      for (let x = 0; x < w; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // ATS card outlines
      cards.forEach((c) => {
        const cx = c.x * w,
          cy = c.y * h;
        const a = 0.06 + 0.02 * Math.sin(t * 0.006 + cx);
        drawRoundRect(cx, cy, c.w, c.h, 8);
        ctx.strokeStyle = `rgba(91,61,245,${a})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        drawRoundRect(cx, cy, c.w, c.h, 8);
        ctx.fillStyle = `rgba(91,61,245,${a * 0.3})`;
        ctx.fill();

        // ATS label
        ctx.font = "500 9px 'JetBrains Mono', monospace";
        ctx.fillStyle = `rgba(91,61,245,${a * 5})`;
        ctx.fillText(c.label, cx + 10, cy + 16);

        // Fake input rows inside card
        for (let i = 0; i < c.fields; i++) {
          const fy = cy + 26 + i * 16;
          const fillProgress = Math.min(
            1,
            Math.max(0, Math.sin(t * 0.012 - i * 0.8) * 0.5 + 0.5),
          );
          // track
          drawRoundRect(cx + 10, fy, c.w - 20, 9, 2);
          ctx.fillStyle = `rgba(91,61,245,${a * 1.2})`;
          ctx.fill();
          // fill bar
          drawRoundRect(cx + 10, fy, (c.w - 20) * fillProgress, 9, 2);
          ctx.fillStyle = `rgba(27,210,156,${a * 4 * fillProgress})`;
          ctx.fill();
        }
      });

      // Node connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(91,61,245,${0.07 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach((n) => {
        const pulse = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.009 + n.phase));
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color},${pulse * 0.6})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${n.color},${pulse * 0.12})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      // Data packets travelling between nodes
      packets.forEach((p) => {
        const from = nodes[p.fromIdx % nodes.length];
        const to = nodes[p.toIdx % nodes.length];
        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},0.7)`;
        ctx.fill();
        // trailing glow
        const tx2 = from.x + (to.x - from.x) * Math.max(0, p.progress - 0.06);
        const ty2 = from.y + (to.y - from.y) * Math.max(0, p.progress - 0.06);
        const grad = ctx.createLinearGradient(tx2, ty2, px, py);
        grad.addColorStop(0, `rgba(${p.color},0)`);
        grad.addColorStop(1, `rgba(${p.color},0.35)`);
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.moveTo(tx2, ty2);
        ctx.lineTo(px, py);
        ctx.stroke();
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.fromIdx = Math.floor(Math.random() * nodes.length);
          p.toIdx = Math.floor(Math.random() * nodes.length);
        }
      });

      // Floating field label pills
      ctx.textBaseline = "middle";
      floaters.forEach((f) => {
        const a = f.alpha * (0.75 + 0.25 * Math.sin(t * 0.007 + f.phase));
        ctx.font = `500 ${f.size}px 'JetBrains Mono', monospace`;
        const tw = ctx.measureText(f.text).width;
        const pw = tw + (f.filled ? 30 : 14),
          ph = 16;
        const px = f.x,
          py = f.y;

        drawRoundRect(px - 4, py - ph / 2, pw, ph, 4);
        ctx.fillStyle = f.filled
          ? `rgba(27,210,156,${a * 0.22})`
          : `rgba(91,61,245,${a * 0.16})`;
        ctx.fill();
        ctx.strokeStyle = f.filled
          ? `rgba(27,210,156,${a * 0.45})`
          : `rgba(91,61,245,${a * 0.32})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.fillStyle = f.filled
          ? `rgba(15,110,86,${a * 4})`
          : `rgba(60,52,137,${a * 4})`;
        ctx.fillText(f.text, px, py);

        if (f.filled) {
          ctx.fillStyle = `rgba(27,210,156,${a * 4})`;
          ctx.fillText("✓", px + tw + 5, py);
        }

        f.x += f.vx;
        f.y += f.vy;
        if (f.x < -100 || f.x > w + 100) f.vx *= -1;
        if (f.y < 20 || f.y > h + 20) f.vy *= -1;
      });

      // Horizontal scanner sweep
      const sweep = ((t * 0.35) % (h + 60)) - 30;
      const sg = ctx.createLinearGradient(0, sweep - 28, 0, sweep + 28);
      sg.addColorStop(0, "rgba(91,61,245,0)");
      sg.addColorStop(0.4, "rgba(91,61,245,0.03)");
      sg.addColorStop(0.5, "rgba(27,210,156,0.05)");
      sg.addColorStop(0.6, "rgba(91,61,245,0.03)");
      sg.addColorStop(1, "rgba(91,61,245,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, sweep - 28, w, 56);

      // Diagonal accent lines (like a circuit board)
      ctx.lineWidth = 0.4;
      [0.2, 0.5, 0.8].forEach((xf, i) => {
        const lx = xf * w;
        const a = 0.04 + 0.02 * Math.sin(t * 0.005 + i * 2);
        ctx.strokeStyle = `rgba(91,61,245,${a})`;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx + 80, h);
        ctx.stroke();
      });

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6 20H24v8h11.3C33.6 33.8 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.2 3l5.7-5.7C34.2 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.4-4z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 6 1.1 8.2 3l5.7-5.7C34.2 5.1 29.4 3 24 3 16.4 3 9.9 7.9 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 45c5.2 0 10-1.9 13.7-5.1l-6.3-5.2C29.5 36.5 26.9 37 24 37c-5.2 0-9.6-3.1-11.3-7.6l-6.6 5C9.8 41 16.4 45 24 45z"
    />
    <path
      fill="#1565C0"
      d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.3 5.2C41.6 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"
    />
  </svg>
);

const FIELDS = [
  { label: "First Name", value: "Aryan", delay: 0 },
  { label: "Last Name", value: "Kumar", delay: 300 },
  { label: "Email", value: "aryan@gmail.com", delay: 600 },
  { label: "Phone", value: "+91 98765 43210", delay: 900 },
  { label: "LinkedIn", value: "linkedin.com/in/aryan", delay: 1200 },
  { label: "GitHub", value: "github.com/aryan-k", delay: 1500 },
];

const ATS_PLATFORMS = [
  "Greenhouse",
  "Workday",
  "Lever",
  "Internshala",
  "Naukri",
];

const FilledField = ({ label, value, delay }) => {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setFilled(true), delay + 400);
    return () => clearTimeout(id);
  }, [delay]);
  return (
    <div className="flex items-center gap-2.5 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-[10px] text-gray-400 font-mono w-20 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-6 rounded-md bg-gray-50 border border-gray-200 flex items-center px-2 overflow-hidden relative">
        <span
          className={`text-[11px] font-mono transition-colors duration-300 ${filled ? "text-gray-700" : "text-gray-200"}`}
        >
          {filled ? value : "-"}
        </span>
        {filled && (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <CheckCircle size={10} className="text-[#1bd29c]" />
          </span>
        )}
      </div>
    </div>
  );
};

// ── Right Panel ───────────────────────────────────────────────────────────────
const RightPanel = () => {
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), 3800);
    return () => clearInterval(id);
  }, []);
  const platform = ATS_PLATFORMS[cycle % ATS_PLATFORMS.length];

  return (
    <div
      className="flex-1 flex flex-col justify-between p-8 overflow-hidden"
      style={{ background: "#fafafa", borderLeft: "1px solid #f0f0f4" }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1bd29c] animate-pulse" />
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            Live demo - {platform}
          </span>
        </div>
        <h2
          className="text-[18px] font-semibold text-gray-900 leading-snug tracking-tight"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Filling 24 fields
          <br />
          <span style={{ color: "#5b3df5" }}>in 8 seconds flat.</span>
        </h2>
        <p className="text-[11.5px] text-gray-400 mt-1">
          AI reads your resume once. Fills every ATS forever.
        </p>
      </div>

      <div
        className="rounded-xl border border-gray-200 bg-white overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 bg-gray-50">
          <span className="w-2 h-2 rounded-full bg-red-300" />
          <span className="w-2 h-2 rounded-full bg-yellow-300" />
          <span className="w-2 h-2 rounded-full bg-green-300" />
          <div className="flex-1 mx-2 h-5 rounded-md bg-white border border-gray-200 flex items-center px-2">
            <span className="text-[9px] font-mono text-gray-400 truncate">
              myworkdayjobs.com/stripe/apply
            </span>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-medium"
            style={{ background: "#ede8ff", color: "#5b3df5" }}
          >
            <Zap size={8} />
            HireLane
          </div>
        </div>
        <div className="px-4 py-2">
          {FIELDS.map((f) => (
            <FilledField
              key={f.label + cycle}
              label={f.label}
              value={f.value}
              delay={f.delay}
            />
          ))}
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-gray-400">
              Filling progress
            </span>
            <span className="text-[9px] font-mono" style={{ color: "#5b3df5" }}>
              24 / 24 fields
            </span>
          </div>
          <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-[2000ms]"
              style={{
                width: "100%",
                background: "linear-gradient(90deg,#5b3df5,#1bd29c)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: Clock,
            label: "Avg fill time",
            val: "8.1s",
            color: "#5b3df5",
          },
          { icon: Shield, label: "ATS platforms", val: "5", color: "#1bd29c" },
          {
            icon: TrendingUp,
            label: "Cache hit rate",
            val: "94%",
            color: "#ef9f27",
          },
        ].map(({ icon: Icon, label, val, color }) => (
          <div
            key={label}
            className="rounded-lg border border-gray-200 bg-white p-3 text-center"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
          >
            <Icon size={14} style={{ color, margin: "0 auto 4px" }} />
            <div className="text-[15px] font-semibold text-gray-900 font-mono leading-none">
              {val}
            </div>
            <div className="text-[9px] text-gray-400 mt-0.5 font-mono leading-tight">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        {["JWT secured", "No passwords stored", "Redis OTP cache"].map(
          (item) => (
            <div key={item} className="flex items-center gap-1">
              <CheckCircle size={10} className="text-[#1bd29c] shrink-0" />
              <span className="text-[9.5px] font-mono text-gray-400">
                {item}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

// ── Input Field ───────────────────────────────────────────────────────────────
const InputField = ({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  rightEl,
  extra,
  compact,
}) => (
  <div className={`flex flex-col ${compact ? "gap-0.5" : "gap-1"}`}>
    <div className="flex items-center justify-between">
      <label className="text-[9.5px] font-medium text-gray-400 uppercase tracking-widest font-mono">
        {label}
      </label>
      {extra}
    </div>
    <div className="relative">
      <Icon
        size={12}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
      />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full pl-8 pr-8 text-[12.5px] text-gray-900 placeholder-gray-300 bg-white rounded-lg border border-gray-200 outline-none transition-all focus:border-[#5b3df5] focus:shadow-[0_0_0_3px_rgba(91,61,245,0.08)]"
        style={{ height: compact ? 34 : 38 }}
      />
      {rightEl}
    </div>
  </div>
);

// ── Auth Page ─────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasLength = password.length >= 8;
  const hasSpecial = /[0-9!@#$%^&*]/.test(password);
  const passwordsMatch = password === confirm && confirm.length > 0;
  const isSignup = tab === "signup";

  const reset = (t) => {
    setTab(t);
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setShowPass(false);
    setShowConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
      style={{ background: "#f0effa" }}
    >
      <AnimatedBg />

      {/* Modal */}
      <div
        className="relative flex w-full overflow-hidden bg-white"
        style={{
          zIndex: 1,
          maxWidth: 940,
          borderRadius: 18,
          border: "1px solid #e8e8f0",
          boxShadow:
            "0 8px 48px rgba(91,61,245,0.12), 0 1px 0 rgba(255,255,255,0.9) inset",
        }}
      >
        {/* ── Left: Form ── */}
        <div className="w-[380px] shrink-0 flex flex-col px-8 py-7">
          {/* Brand */}
          <div className="flex items-center mb-4 gap-2 font-bold cursor-pointer transition-transform duration-300 hover:scale-105">
            <img src={logo} alt="" className="w-10 h-10" />
            <h2>
              <span className="text-[#1bd29c] text-xl">Hire</span>
              <span className="text-[#602fe2] text-xl">Lane</span>
            </h2>
          </div>

          {/* Tab switcher */}
          <div
            className="flex p-[3px] mb-5 rounded-[10px]"
            style={{ background: "#f4f4f8", border: "1px solid #ebebf2" }}
          >
            {[
              ["login", "Log In"],
              ["signup", "Sign Up"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => reset(k)}
                className="flex-1 py-[6px] text-[12.5px] font-medium rounded-[8px] transition-all cursor-pointer border"
                style={{
                  background: tab === k ? "#fff" : "transparent",
                  color: tab === k ? "#111" : "#aaa",
                  borderColor: tab === k ? "#e4e4ed" : "transparent",
                  boxShadow: tab === k ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-4">
            <h1
              className="text-[20px] font-bold text-gray-950 tracking-tight leading-tight"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-[11.5px] text-gray-400 mt-0.5">
              {isSignup
                ? "Free forever · 15 auto-fills/month · No card needed."
                : "Sign in to your career intelligence dashboard."}
            </p>
          </div>

          {/* Google */}
          <button
            className="w-full flex items-center justify-center gap-2.5 text-[12.5px] font-medium text-gray-700 rounded-xl transition-all cursor-pointer mb-4 hover:bg-gray-50"
            style={{
              height: 38,
              background: "#fff",
              border: "1px solid #e0e0ea",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <GoogleIcon />
            {isSignup ? "Sign up with Google" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "#ebebf2" }} />
            <span className="text-[10px] text-gray-300 font-mono tracking-wide">
              or email
            </span>
            <div className="flex-1 h-px" style={{ background: "#ebebf2" }} />
          </div>

          {/* Form fields */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col"
            style={{ gap: isSignup ? 8 : 12 }}
          >
            {isSignup && (
              <InputField
                compact
                label="Full Name"
                icon={User}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aryan Kumar"
              />
            )}

            <InputField
              compact={isSignup}
              label="Email"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              rightEl={
                isValidEmail && email ? (
                  <CheckCircle
                    size={11}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1bd29c]"
                  />
                ) : null
              }
            />

            <InputField
              compact={isSignup}
              label="Password"
              icon={Lock}
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                isSignup ? "Create a strong password" : "Enter your password"
              }
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
                >
                  {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              }
              extra={
                !isSignup && (
                  <a
                    href="#"
                    className="text-[10.5px] hover:underline"
                    style={{ color: "#5b3df5" }}
                  >
                    Forgot password?
                  </a>
                )
              }
            />

            {isSignup && password.length > 0 && (
              <div className="flex gap-3 -mt-0.5">
                {[
                  { met: hasLength, label: "8+ chars" },
                  { met: hasSpecial, label: "Number/symbol" },
                ].map(({ met, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    {met ? (
                      <CheckCircle size={10} style={{ color: "#5b3df5" }} />
                    ) : (
                      <Circle size={10} className="text-gray-200" />
                    )}
                    <span
                      className={`text-[10px] transition-colors ${met ? "text-gray-600" : "text-gray-300"}`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {isSignup && (
              <div className="flex flex-col gap-0.5">
                <label className="text-[9.5px] font-medium text-gray-400 uppercase tracking-widest font-mono">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="off"
                    className={`w-full pl-8 pr-8 text-[12.5px] text-gray-900 placeholder-gray-300 bg-white rounded-lg border outline-none transition-all focus:shadow-[0_0_0_3px_rgba(91,61,245,0.08)]
                      ${
                        confirm.length > 0
                          ? passwordsMatch
                            ? "border-[#1bd29c] focus:border-[#1bd29c]"
                            : "border-red-300 focus:border-red-400"
                          : "border-gray-200 focus:border-[#5b3df5]"
                      }`}
                    style={{ height: 34 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                {confirm.length > 0 && !passwordsMatch && (
                  <p className="text-[10px] text-red-400 font-mono">
                    Passwords don't match
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white text-[13px] font-semibold rounded-xl transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{
                height: 40,
                fontFamily: "Syne, sans-serif",
                background: "#5b3df5",
                boxShadow: "0 3px 12px rgba(91,61,245,0.32)",
                marginTop: isSignup ? 2 : 4,
              }}
            >
              {loading ? (
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <>
                  {isSignup ? "Create Account" : "Sign In"}{" "}
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-gray-400">
              {isSignup ? (
                <>
                  Have an account?{" "}
                  <button
                    onClick={() => reset("login")}
                    className="font-medium hover:underline bg-transparent border-none cursor-pointer"
                    style={{ color: "#5b3df5" }}
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  No account?{" "}
                  <button
                    onClick={() => reset("signup")}
                    className="font-medium hover:underline bg-transparent border-none cursor-pointer"
                    style={{ color: "#5b3df5" }}
                  >
                    Create one free
                  </button>{" "}
                  - no card required.
                </>
              )}
            </p>
            <p className="text-[10px] text-gray-300 mt-1">
              <a href="#" className="hover:underline">
                Terms
              </a>{" "}
              ·{" "}
              <a href="#" className="hover:underline">
                Privacy
              </a>
            </p>
          </div>
        </div>

        {/* ── Right: Product preview ── */}
        <RightPanel />
      </div>
    </div>
  );
}
