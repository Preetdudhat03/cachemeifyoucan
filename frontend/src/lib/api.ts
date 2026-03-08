/**
 * API client for the AI Market Search Engine.
 * Sends POST to Next.js API route which proxies to PYTHON_SEARCH_API.
 */

import type { SearchRequest, BackendSearchResponse } from "./types";

const API_BASE = "/api";

export async function searchOptions(
  request: SearchRequest
): Promise<BackendSearchResponse> {
  const res = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: request.query }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `Search failed: ${res.status}`);
  }

  return res.json() as Promise<BackendSearchResponse>;
}
