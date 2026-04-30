export function TrendingMovies() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Trending Movies
          </h2>
          <p className="text-slate-600 mt-2 text-lg">
            Popular picks you might like
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[2/3] bg-slate-200 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm font-medium border border-dashed border-slate-300">
                  Poster
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-slate-700">Title</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}