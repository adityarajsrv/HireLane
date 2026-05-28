const FREE_FEATURES = [
  "15 autofills / month",
  "Basic tracker",
  "Workday + Greenhouse",
  "Manual cover letters",
];

const PRO_FEATURES = [
  "Unlimited autofills",
  "All ATS platforms",
  "AI cover letters",
  "Advanced tracker + insights",
  "Multiple resume profiles",
  "Priority support",
];

function Check({ pro }) {
  return (
    <svg
      className={`mt-0.5 h-4 w-4 shrink-0 ${pro ? "text-[#5b3df5]" : "text-emerald-500"}`}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureList({ items, pro }) {
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {items.map((f) => (
        <li
          key={f}
          className="flex items-start gap-2.5 text-[14px] text-gray-600"
        >
          <Check pro={pro} />
          {f}
        </li>
      ))}
    </ul>
  );
}

const Pricing = () => (
  <section className="bg-[#fafafa] py-18">
    <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5b3df5]">
          Pricing
        </p>
        <h2 className="mt-5 text-[clamp(2.6rem,5vw,4rem)] font-black leading-[1.07] tracking-tight text-gray-950">
          Cheaper than one resume{" "}
          <em className="font-['Instrument_Serif'] italic font-normal">
            review.
          </em>
        </h2>
        <p className="mt-5 text-[16px] text-gray-400">
          Free forever for casual hunts. Pro for when you mean business.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 max-w-3xl mx-auto">
        <div className="group relative rounded-[28px] border border-gray-200 bg-white p-8 transition-all duration-300 hover:scale-[1.02] hover:border-[#5b3df5]/30 hover:shadow-[0_16px_48px_-8px_rgba(91,61,245,0.1)]">
          <p className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-gray-400">
            Free
          </p>
          <div className="mt-4 flex items-end gap-1.5">
            <span className="text-[52px] font-black leading-none tracking-[-0.04em] text-gray-950">
              ₹0
            </span>
            <span className="mb-2 text-[14px] text-gray-400">forever</span>
          </div>
          <p className="mt-1.5 text-[13px] text-gray-400">
            For casual applications
          </p>
          <button className="mt-6 w-full rounded-xl bg-gray-950 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] cursor-pointer">
            Add to Chrome
          </button>
          <FeatureList items={FREE_FEATURES} pro={false} />
        </div>
        <div className="group relative rounded-[28px] border-2 border-[#5b3df5]/60 bg-white p-8 transition-all duration-300 hover:scale-[1.02] hover:border-[#5b3df5] hover:shadow-[0_20px_60px_-8px_rgba(91,61,245,0.22)]">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center rounded-full bg-[#5b3df5] px-3.5 py-1 text-[10px] font-bold tracking-widest uppercase text-white shadow-[0_4px_14px_rgba(91,61,245,0.4)]">
              Most Popular
            </span>
          </div>
          <p className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-[#5b3df5]">
            Pro
          </p>
          <div className="mt-4 flex items-end gap-1.5">
            <span className="text-[52px] font-black leading-none tracking-[-0.04em] text-gray-950">
              ₹99
            </span>
            <span className="mb-2 text-[14px] text-gray-400">/month</span>
          </div>
          <p className="mt-1.5 text-[13px] text-gray-400">
            For serious job seekers
          </p>
          <button className="mt-6 w-full rounded-xl bg-[#5b3df5] py-3 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(91,61,245,0.35)] transition-all duration-200 hover:bg-[#4a2ee0] hover:shadow-[0_8px_28px_rgba(91,61,245,0.45)] active:scale-[0.98] cursor-pointer">
            Start 7-day trial
          </button>
          <FeatureList items={PRO_FEATURES} pro={true} />
        </div>
      </div>
      <p className="mt-10 text-center text-[12.5px] text-gray-400">
        No credit card required for trial · Cancel anytime · Instant setup
      </p>
    </div>
  </section>
);

export default Pricing;
