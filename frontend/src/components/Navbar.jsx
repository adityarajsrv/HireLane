import { useEffect, useState } from "react";
import { FaChrome } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

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
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 transition-all hover:border-[#602fe2] hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#602fe2] text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </button>

              <button
                onClick={logout}
                className="cursor-pointer rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                Logout
              </button>
            </>
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
