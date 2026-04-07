const CACHE_TTL_MS = Number(process.env.CACHE_TTL_SECONDS || 60) * 1000;
const EXTERNAL_API_BASE_URL =
  process.env.EXTERNAL_API_BASE_URL || "https://api.datamuse.com/words";
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY || "";
let totalSearches = 0;

// Simple in-memory cache: one entry per query string.
const cacheByQuery = new Map();

function buildExternalUrl(query) {
  const url = new URL(EXTERNAL_API_BASE_URL);
  url.searchParams.set("ml", query);
  url.searchParams.set("max", "10");

  // Optional API key support for providers that require it.
  if (EXTERNAL_API_KEY) {
    url.searchParams.set("apiKey", EXTERNAL_API_KEY);
  }

  return url;
}

export function incrementSearchCount() {
  totalSearches += 1;
}

export function getSearchCount() {
  return totalSearches;
}

export function resetSearchCount() {
  totalSearches = 0;
}

export async function fetchExternalData(query) {
  const now = Date.now();
  const cached = cacheByQuery.get(query);

  if (cached && now - cached.savedAt < CACHE_TTL_MS) {
    console.log(`[CACHE] HIT for query='${query}'`);
    return {
      cached: true,
      items: cached.items
    };
  }

  console.log(`[CACHE] MISS for query='${query}'. Fetching external API...`);

  const url = buildExternalUrl(query);
  console.log(`[API] Calling external API for query='${query}'`);
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const error = new Error(`External API failed with status ${response.status}`);
    error.statusCode = 502;
    error.publicMessage = "Failed to fetch data from upstream API";
    throw error;
  }

  const raw = await response.json();

  // Normalize data shape so frontend can stay stable.
  const items = Array.isArray(raw)
    ? raw.map((item) => ({
        term: item.word,
        score: item.score
      }))
    : [];

  cacheByQuery.set(query, {
    savedAt: now,
    items
  });

  return {
    cached: false,
    items
  };
}
