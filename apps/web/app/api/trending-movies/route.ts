import { NextResponse } from "next/server";

type TmdbMovie = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

type TmdbTrendingResponse = {
  results?: TmdbMovie[];
};

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "TMDB_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const url = new URL(`${TMDB_API_BASE_URL}/trending/movie/week`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");

  try {
    const response = await fetch(url, {
      next: { revalidate },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch trending movies from TMDB." },
        { status: response.status },
      );
    }

    const data = (await response.json()) as TmdbTrendingResponse;
    const movies = (data.results ?? [])
      .filter((movie) => movie.poster_path)
      .slice(0, 10)
      .map((movie) => {
        const date = movie.release_date ?? movie.first_air_date ?? "";

        return {
          id: movie.id,
          title: movie.title ?? movie.name ?? "Untitled",
          overview: movie.overview ?? "",
          posterUrl: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
          releaseYear: date ? new Date(date).getFullYear() : null,
          rating:
            typeof movie.vote_average === "number"
              ? Number(movie.vote_average.toFixed(1))
              : null,
        };
      });

    return NextResponse.json(
      { movies },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to TMDB." },
      { status: 502 },
    );
  }
}
