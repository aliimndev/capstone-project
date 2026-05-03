/**
 * Cloudflare Worker - TMDB API Proxy
 * Handles API requests with caching and rate limiting
 */

interface Env {
	TMDB_API_KEY: string;
	API_BACKEND_URL?: string;
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

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

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
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		try {
			// Determine cache duration based on endpoint
			let cacheTTL = CACHE_TTL.recommendations;
			if (path.includes("/trending")) cacheTTL = CACHE_TTL.trending;
			if (path.includes("/search")) cacheTTL = CACHE_TTL.search;

			// Generate cache key
			const cacheKey = new Request(url.toString(), { method: "GET" });
			const cache = (caches as any).default;

			// Check cache
			let response = await cache.match(cacheKey);
			if (response) {
				return addCORSHeaders(response.clone());
			}

			// Route to backend API
			const backendUrl = env.API_BACKEND_URL || "http://localhost:8000";
			const backendRequest = new Request(`${backendUrl}${path}${url.search}`, {
				method: request.method,
				headers: {
					...Object.fromEntries(request.headers.entries()),
					"X-TMDB-API-Key": env.TMDB_API_KEY,
				},
				body: request.body,
			});

			response = await fetch(backendRequest);

			// Cache successful responses
			if (response.status === 200 && request.method === "GET") {
				const cachedResponse = response.clone();
				ctx.waitUntil(
					cache.put(
						cacheKey,
						new Response(cachedResponse.body, {
							status: cachedResponse.status,
							statusText: cachedResponse.statusText,
							headers: {
								...Object.fromEntries(cachedResponse.headers.entries()),
								"Cache-Control": `public, max-age=${cacheTTL}`,
							},
						})
					)
				);
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
