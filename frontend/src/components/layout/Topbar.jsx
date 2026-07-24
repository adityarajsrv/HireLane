import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.png";

const Topbar = ({ onSearch, onNavigate }) => {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      onSearch(searchValue.trim());
      onNavigate("applications");
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search applications, press Enter..."
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

      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center justify-center rounded-full text-white"
          style={{
            width: 28,
            height: 28,
            background: "#5b3df5",
            fontSize: 10,
            fontFamily: "Syne, sans-serif",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          {initials}
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-2 bg-white rounded-xl overflow-hidden z-50"
            style={{
              width: 200,
              border: "1px solid #f0f0f4",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="px-3 py-3"
              style={{ borderBottom: "1px solid #f0f0f4" }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  color: "#0a0a0f",
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#9ca3af",
                }}
              >
                {user?.email}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#5b3df5",
                  marginTop: 2,
                  textTransform: "capitalize",
                }}
              >
                {user?.plan} plan
              </div>
            </div>
            <button
              onClick={() => {
                setDropdownOpen(false);
                onNavigate("settings");
              }}
              className="w-full text-left px-3 py-2"
              style={{
                fontSize: 12,
                fontFamily: "DM Sans, sans-serif",
                color: "#374151",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5f4ff")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              Settings
            </button>
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2"
              style={{
                fontSize: 12,
                fontFamily: "DM Sans, sans-serif",
                color: "#e24b4a",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fcebeb")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
