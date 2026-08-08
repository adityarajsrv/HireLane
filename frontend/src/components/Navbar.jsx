import { useEffect, useRef, useState } from "react";
import { FaChrome } from "react-icons/fa";
import { LayoutDashboard, Settings, Puzzle, LogOut, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  // Navigates to /dashboard and passes which internal page to land on —
  // DashboardApp reads this from location.state since activePage is
  // local component state, not a route param.
  const goToPage = (page) => {
    setMenuOpen(false);
    navigate("/dashboard", { state: { page } });
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Extension", icon: Puzzle, page: "extension" },
    { label: "Settings", icon: Settings, page: "settings" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 font-bold cursor-pointer transition-transform duration-300 hover:scale-105">
          <img src={logo} alt="" className="w-10 h-10" />
          <h2>
            <span className="text-[#1bd29c] text-xl">Hire</span>
            <span className="text-[#602fe2] text-xl">Lane</span>
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-10 text-gray-700">
          {["Home", "Features", "Pricing", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative transition-colors duration-300 hover:text-[#602fe2]"
            >
              {item}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#602fe2] transition-all duration-300 hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-1.5 py-1.5 pr-2.5 transition-all duration-200 ${
                  menuOpen
                    ? "border-[#602fe2] bg-white shadow-md"
                    : "border-gray-200 bg-white hover:border-[#602fe2]/50 hover:shadow-sm"
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#602fe2] to-[#1bd29c] text-xs font-semibold text-white">
                  {initial}
                </div>
                <ChevronDown
                  size={13}
                  className={`text-gray-400 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown — compact */}
              <div
                className={`absolute right-0 mt-2 w-44 origin-top-right rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-150 ${
                  menuOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="truncate text-xs font-semibold text-gray-900">
                    {user?.name}
                  </p>
                  <p className="truncate text-[11px] text-gray-400">{user?.email}</p>
                </div>

                <div className="py-1">
                  {menuItems.map(({ label, icon: Icon, page }) => (
                    <button
                      key={label}
                      onClick={() => goToPage(page)}
                      className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#602fe2]"
                    >
                      <Icon size={14} className="text-gray-400" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-[13px] text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="cursor-pointer text-gray-700 transition-colors hover:text-[#602fe2]"
              >
                Sign In
              </button>

              <button className="cursor-pointer group rounded-full bg-[#602fe2] px-6 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-[#4f24c9] hover:shadow-lg">
                <span className="flex items-center gap-2">
                  Add to Chrome
                  <FaChrome className="transition-transform duration-300 group-hover:rotate-12" />
                </span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;