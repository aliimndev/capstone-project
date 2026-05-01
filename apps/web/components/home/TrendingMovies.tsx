export function TrendingMovies() {
  return (
    <section className="py-16 bg-[#000000]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-[#ffffff]">
            Trending Movies
          </h2>
          <p className="text-white/60 mt-2 text-lg">
            Popular picks you might like
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[2/3] bg-white/10 rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08)] group-hover:shadow-[0_0_36px_rgba(0,153,255,0.22)] transition-all">
                <div className="h-full w-full flex items-center justify-center text-white/40 text-sm font-medium border border-dashed border-white/20">
                  Poster
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-white/80">Title</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
