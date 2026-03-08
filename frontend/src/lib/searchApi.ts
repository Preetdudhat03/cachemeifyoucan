/**
 * API client for the AI Market Search Engine.
 */

import type { SearchRequest, BackendSearchResponse } from "./searchTypes";
import { getApiBaseUrl, safeFetch } from './apiConfig';

export async function searchOptions(
  request: SearchRequest
): Promise<BackendSearchResponse> {
  const API_BASE = getApiBaseUrl();
  return safeFetch(`${API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: request.query }),
  });
}
