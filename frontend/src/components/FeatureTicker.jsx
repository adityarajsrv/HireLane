const features = [
  "AI Cover Letters",
  "One-click Apply",
  "Auto-fill Workday",
  "Tracks Applications",
  "Smart Resume Mapping",
  "Chrome Extension",
  "LinkedIn Sync",
  "ATS Optimized",
];

const FeatureTicker = () => {
  return (
    <div className="relative overflow-hidden border-y border-gray-100/80 bg-white backdrop-blur-sm">
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-linear-to-r from-[#fafafa] to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-linear-to-l from-[#fafafa] to-transparent" />
      <div className="ticker flex w-max items-center py-5">
        {[...features, ...features].map((feature, i) => (
          <div
            key={i}
            className="flex items-center"
          >
            <div className="flex items-center gap-3 px-8">
              <div className="h-1.5 w-1.5 rounded-full bg-[#5b3df5]" />
              <span className="whitespace-nowrap text-[15px] font-medium tracking-[-0.01em] text-gray-600">
                {feature}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureTicker;