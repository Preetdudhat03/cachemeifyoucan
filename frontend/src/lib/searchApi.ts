/**
 * API client for the AI Market Search Engine.
 */

import type { SearchRequest, BackendSearchResponse } from "./searchTypes";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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
