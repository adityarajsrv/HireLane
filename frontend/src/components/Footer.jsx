import logo from "../assets/logo.png";

const LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

const Footer = () => (
  <footer className="border-t border-gray-100 bg-[#fafafa]">
    <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1 leading-none">
            <img
              src={logo}
              alt="HireLane logo"
              className="h-8 w-8 object-contain"
            />
            <h3>
              <span className="text-[#1bd29c] text-[18px] font-bold tracking-tight">Hire</span>
              <span className="text-[#602fe2] text-[18px] font-bold tracking-tight">Lane</span>
            </h3>
          </div>
          <p className="text-[12px] text-gray-400 leading-relaxed max-w-50">
            Autofill every job application. Instantly.
          </p>
        </div>
        <nav className="flex items-center justify-start gap-5 md:justify-center">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[13px] text-gray-400 transition-colors duration-150 hover:text-[#602fe2]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p className="text-[12px] text-gray-400 md:text-right">
          Made with{" "}
          <span className="text-[#602fe2] font-medium">frustration</span> by job
          seekers.
        </p>
      </div>
      <div className="mt-6 flex flex-col items-start gap-1 border-t border-gray-100 pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-[11.5px] text-gray-300">
          © 2026 HireLane. All rights reserved.
        </p>
        <p className="text-[11.5px] text-gray-300">
          Built for the 100× job seeker.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
