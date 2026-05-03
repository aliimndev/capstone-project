/**
 * Cloudflare Worker - TMDB API Proxy
 * Handles API requests with caching and direct TMDB integration
 */

interface Env {
	TMDB_API_KEY: string;
	API_BACKEND_URL?: string;
	TMDB_BASE_URL?: string;
}

interface ExecutionContext {
	waitUntil(promise: Promise<any>): void;
}

const CACHE_TTL = {
	trending: 3600,      // 1 hour
	search: 1800,        // 30 minutes
	recommendations: 600, // 10 minutes
	health: 60,          // 1 minute
};

const DEFAULT_TMDB_BASE = "https://api.themoviedb.org/3";

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname.replace(/\/+$/, "");

		// Health check
		if (path === "/health") {
			return new Response(
				JSON.stringify({
					status: "healthy",
					timestamp: new Date().toISOString(),
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
						"Cache-Control": `public, max-age=${CACHE_TTL.health}`,
					},
				}
			);
		}

		// CORS preflight
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: getCORSHeaders(),
			});
		}

		try {
			let response: Response;

			if (env.API_BACKEND_URL) {
				response = await proxyToBackend(request, path, url, env);
			} else {
				response = await handleTmdbRequest(request, path, url, env);
			}

			if (request.method === "GET") {
				const cacheKey = new Request(url.toString(), { method: "GET" });
				const cache = (caches as any).default;
				const cachedResponse = await cache.match(cacheKey);
				if (cachedResponse) {
					return addCORSHeaders(cachedResponse.clone());
				}

				if (response.status === 200) {
					const responseClone = response.clone();
					ctx.waitUntil(
						cache.put(
							cacheKey,
							new Response(responseClone.body, {
								status: responseClone.status,
								statusText: responseClone.statusText,
								headers: {
									...Object.fromEntries(responseClone.headers.entries()),
									"Cache-Control": `public, max-age=${getCacheTTL(path)}`,
								},
							})
						)
					);
				}
			}

			return addCORSHeaders(response);
		} catch (error) {
			console.error("Worker error:", error);
			return new Response(
				JSON.stringify({
					error: "Internal Server Error",
					message: error instanceof Error ? error.message : "Unknown error",
				}),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
						...getCORSHeaders(),
					},
				}
			);
		}
	},
};

function getCacheTTL(path: string): number {
	if (path.includes("/trending")) return CACHE_TTL.trending;
	if (path.includes("/search")) return CACHE_TTL.search;
	return CACHE_TTL.recommendations;
}

async function proxyToBackend(
	request: Request,
	path: string,
	url: URL,
	env: Env
): Promise<Response> {
	const backendUrl = env.API_BACKEND_URL || "http://localhost:8000";
	const backendRequest = new Request(`${backendUrl}${path}${url.search}`, {
		method: request.method,
		headers: {
			...Object.fromEntries(request.headers.entries()),
			"X-TMDB-API-Key": env.TMDB_API_KEY,
		},
		body: request.body,
	});
	return fetch(backendRequest);
}

async function handleTmdbRequest(
	request: Request,
	path: string,
	url: URL,
	env: Env
): Promise<Response> {
	const tmdbBase = env.TMDB_BASE_URL || DEFAULT_TMDB_BASE;

	if (path === "/api/v1/recommendations/trending") {
		const timeWindow = url.searchParams.get("time_window") || "week";
		return fetch(
			`${tmdbBase}/trending/movie/${encodeURIComponent(timeWindow)}?api_key=${env.TMDB_API_KEY}&language=en-US`
		);
	}

	if (path === "/api/v1/recommendations/search") {
		const query = url.searchParams.get("query") || "";
		if (!query) {
			return new Response(
				JSON.stringify({ error: "Query parameter is required." }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		}
		return fetch(
			`${tmdbBase}/search/movie?api_key=${env.TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
				query
			)}&page=1&include_adult=false`
		);
	}

	if (path === "/api/v1/recommendations") {
		if (request.method !== "POST") {
			return new Response(
				JSON.stringify({ error: "Method not allowed." }),
				{
					status: 405,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		}

		const body = await request.json().catch(() => null);
		if (!body) {
			return new Response(
				JSON.stringify({ error: "Invalid JSON body." }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		}

		if (body.movie_id) {
			return fetch(
				`${tmdbBase}/movie/${encodeURIComponent(body.movie_id)}/recommendations?api_key=${env.TMDB_API_KEY}&language=en-US&page=1`
			);
		}

		if (body.query) {
			return fetch(
				`${tmdbBase}/search/movie?api_key=${env.TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
					body.query
				)}&page=1&include_adult=false`
			);
		}

		return new Response(
			JSON.stringify({ error: "Please provide either movie_id or query." }),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}

	return new Response(
		JSON.stringify({ error: "Not Found." }),
		{
			status: 404,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
}

function addCORSHeaders(response: Response): Response {
	const newResponse = response.clone();
	const headers = new Headers(newResponse.headers);
	headers.set("Access-Control-Allow-Origin", "*");
	headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	headers.set("Access-Control-Allow-Headers", "Content-Type");

	return new Response(newResponse.body, {
		status: newResponse.status,
		statusText: newResponse.statusText,
		headers,
	});
}

function getCORSHeaders(): Record<string, string> {
	return {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};
}
