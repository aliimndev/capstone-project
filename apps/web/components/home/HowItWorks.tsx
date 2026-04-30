// components/sections/HowItWorks.tsx

const steps = [
  { id: 1, title: "Pick Your Favorites" },
  { id: 2, title: "We Analyze Your Preferences" },
  { id: 3, title: "Get Personalized Recommendations" },
  { id: 4, title: "Refine Your Results" },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-right mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-slate-950">
            How It Works
          </h2>
        </div>

        {/* Cards dengan ukuran tetap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-slate-200 min-h-[260px] flex flex-col"
            >
              {/* Area kosong yang ukurannya tetap */}
              <div className="flex-1 flex items-center justify-center">
                <h3 className="text-xl font-semibold text-slate-900 text-center">
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