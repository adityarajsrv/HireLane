import { useEffect, useState } from "react";
import { FaChrome } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
          <button
            onClick={() => navigate("/auth")}
            className="cursor-pointer text-gray-700 transition-colors duration-300 hover:text-[#602fe2]"
          >
            Sign In
          </button>
          <button className="cursor-pointer group rounded-full bg-[#602fe2] px-6 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-[#4f24c9] hover:shadow-lg">
            <span className="flex items-center gap-2">
              Add to Chrome
              <FaChrome className="transition-transform duration-300 group-hover:rotate-12" />
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
