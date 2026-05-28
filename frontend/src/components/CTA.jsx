// import { useEffect, useRef, useState } from "react";

import { ExternalLink } from "lucide-react";

const BROWSER_SITES = [
  { name: "Stripe", url: "stripe.com/jobs", color: "#635BFF" },
  { name: "Linear", url: "linear.app/careers", color: "#5E6AD2" },
  { name: "Vercel", url: "vercel.com/careers", color: "#000000" },
  { name: "Notion", url: "notion.so/careers", color: "#555555" },
  { name: "Figma", url: "figma.com/careers", color: "#A259FF" },
  { name: "Ashby", url: "jobs.ashbyhq.com", color: "#0070f3" },
  { name: "Arc", url: "arc.net/jobs", color: "#FF6347" },
  { name: "Clerk", url: "clerk.com/careers", color: "#6C47FF" },
];

function MiniWindow({ site, style }) {
  return (
    <div
      className="w-55 shrink-0 rounded-xl border border-gray-200 bg-white shadow-[0_8px_32px_-4px_rgba(0,0,0,0.10)] overflow-hidden"
      style={style}
    >
      <div className="flex items-center gap-1.5 bg-[#f5f5f5] px-3 py-2.5 border-b border-gray-200">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 flex-1 rounded-md bg-gray-200/70 px-2 py-0.5 text-[10px] text-gray-400 font-mono truncate">
          {site.url}
        </span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-0.5">
          <div
            className="h-5 w-5 rounded-md flex items-center justify-center text-[8px] font-bold text-white shrink-0"
            style={{ background: site.color }}
          >
            {site.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="h-2.5 flex-1 rounded-full bg-gray-100" />
        </div>
        <div className="h-1.5 w-4/5 rounded-full bg-gray-100" />
        <div className="h-1.5 w-3/5 rounded-full bg-gray-100" />
        <div className="mt-1 h-7 w-full rounded-lg bg-gray-950/5 border border-gray-200 flex items-center px-2.5 gap-1.5">
          <span className="h-1.5 w-1/3 rounded-full bg-gray-200" />
          <span className="h-1.5 w-1/4 rounded-full bg-gray-200" />
        </div>
        <div className="h-7 w-full rounded-lg bg-gray-950/5 border border-gray-200 flex items-center px-2.5 gap-1.5">
          <span className="h-1.5 w-2/5 rounded-full bg-gray-200" />
        </div>
        <div className="mt-1 flex items-center gap-1.5 rounded-lg bg-[#5b3df5]/8 border border-[#5b3df5]/20 px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5b3df5] animate-pulse" />
          <span className="text-[9.5px] font-semibold text-[#5b3df5]">
            Filled by HireLane
          </span>
        </div>
      </div>
    </div>
  );
}

const CTA = () => {
  const doubled = [...BROWSER_SITES, ...BROWSER_SITES];

  return (
    <section className="bg-[#fafafa] py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-[clamp(2.6rem,5vw,4.2rem)] font-black leading-[1.07] tracking-tight text-gray-950">
            Your next offer is <br />
            <em className="font-['Instrument_Serif'] italic font-normal">
              a few clicks away.
            </em>
          </h2>
          <p className="mt-6 text-[17px] text-gray-400 leading-relaxed">
            Stop spending 20 minutes per application.{" "}
            <span className="text-gray-700 font-medium">Spend 20 seconds.</span>
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <button className="cursor-pointer group inline-flex items-center gap-3 rounded-2xl bg-gray-950 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_8px_32px_-4px_rgba(0,0,0,0.28)] transition-all duration-300 hover:bg-[#5b3df5] hover:shadow-[0_12px_40px_-4px_rgba(91,61,245,0.45)] hover:-translate-y-0.5 active:scale-[0.98]">
              <ExternalLink />
              Add to Chrome - it's free
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium">
                2 min setup
              </span>
            </button>
            <p className="text-[12px] text-gray-400">
              No account needed · Works instantly
            </p>
          </div>
        </div>
      </div>
      <div className="mt-20 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-linear-to-l from-white to-transparent" />
        <div className="overflow-hidden">
          <div className="ticker flex gap-5 pb-2 pt-4 w-max">
            {doubled.map((site, i) => (
              <MiniWindow
                key={`${site.name}-${i}`}
                site={site}
                style={{ rotate: i % 2 === 0 ? "-1.2deg" : "1.2deg" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
