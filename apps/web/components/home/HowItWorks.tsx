// components/sections/HowItWorks.tsx

const steps = [
  { id: 1, title: "Pick Your Favorites" },
  { id: 2, title: "We Analyze Your Preferences" },
  { id: 3, title: "Get Personalized Recommendations" },
  { id: 4, title: "Refine Your Results" },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#000000]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-right mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-[#ffffff]">
            How It Works
          </h2>
        </div>

        {/* Cards dengan ukuran tetap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group bg-white/5 rounded-3xl p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_40px_rgba(0,153,255,0.18)] transition-all duration-300 border border-white/10 hover:border-[#0099ff]/40 min-h-[260px] flex flex-col"
            >
              {/* Area kosong yang ukurannya tetap */}
              <div className="flex-1 flex items-center justify-center">
                <h3 className="text-xl font-semibold text-[#ffffff] text-center">
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
