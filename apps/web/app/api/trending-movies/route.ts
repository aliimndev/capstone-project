import { NextResponse } from 'next/server';

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
}

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error('TMDB_API_KEY is not set in environment variables');
    return NextResponse.json(
      { message: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=en-US`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`TMDB API responded with status ${response.status}`);
    }

    const data = await response.json();

    const normalizedMovies = data.results
      .filter((movie: TMDBMovie) => movie.poster_path)
      .map((movie: TMDBMovie) => ({
        id: movie.id,
        title: movie.title || movie.name || 'Untitled',
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        releaseYear: movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : null,
        rating: movie.vote_average
          ? Number(movie.vote_average.toFixed(1))
          : null,
        voteCount: movie.vote_count || 0,
      }));

    return NextResponse.json({ movies: normalizedMovies });
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return NextResponse.json(
      { message: 'Failed to fetch trending movies' },
      { status: 500 }
    );
  }
}