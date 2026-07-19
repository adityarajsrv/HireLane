import { Search } from "lucide-react";
import logo from "../../assets/logo.png";

const Topbar = () => {
  return (
    <header
      className="flex items-center px-4 bg-white border-b border-[#f0f0f4] shrink-0 gap-4"
      style={{ height: 40 }}
    >
      <div className="flex items-center gap-2 shrink-0" style={{ width: 187 }}>
        <img src={logo} alt="" className="w-8 h-8" />
        <span
          style={{
            fontSize: 16,
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#1bd29c" }}>Hire</span>
          <span style={{ color: "#5b3df5" }}>Lane</span>
        </span>
      </div>
      <div
        className="bg-[#f0f0f4] shrink-0"
        style={{ width: "0.75px", height: 25 }}
      />
      <div className="flex-1 flex items-center">
        <div
          className="flex items-center gap-2 px-3 w-full cursor-text transition-all duration-150"
          style={{
            maxWidth: 420,
            height: 28,
            background: "#f5f4ff",
            border: "1px solid #e8e8f0",
            borderRadius: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#c4b8f8";
            e.currentTarget.style.background = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e8e8f0";
            e.currentTarget.style.background = "#f5f4ff";
          }}
        >
          <Search
            size={12}
            strokeWidth={2}
            color="#9ca3af"
            className="shrink-0"
          />
          <input
            type="text"
            placeholder="Search applications, companies..."
            className="flex-1 bg-transparent outline-none border-none"
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "#0a0a0f",
              caretColor: "#5b3df5",
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-full animate-pulse shrink-0"
            style={{
              width: 6,
              height: 6,
              background: "#1bd29c",
              display: "block",
            }}
          />
          <span
            className="text-[#9ca3af]"
            style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
          >
            model active
          </span>
        </div>
        <div
          className="bg-[#f0f0f4] shrink-0"
          style={{ width: "0.5px", height: 14 }}
        />
        <div className="flex items-center gap-1">
          <span
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#5b3df5",
            }}
          >
            94%
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: "#9ca3af",
            }}
          >
            cache
          </span>
        </div>
        <div
          className="flex items-center justify-center rounded-full text-white shrink-0"
          style={{
            width: 26,
            height: 26,
            background: "#5b3df5",
            fontSize: 10,
            fontFamily: "Syne, sans-serif",
            fontWeight: 600,
          }}
        >
          AK
        </div>
      </div>
    </header>
  );
};

export default Topbar;
