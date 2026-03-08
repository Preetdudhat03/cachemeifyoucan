/**
 * Robust API configuration utility to handle environment-specific URLs.
 * Ensures the /api suffix is present and prevents double slashes.
 */

export function getApiBaseUrl(): string {
    // Use environment variable or fallback to local development
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    // Remove trailing slashes
    baseUrl = baseUrl.replace(/\/+$/, "");

    // Ensure /api suffix if not present
    if (!baseUrl.endsWith("/api")) {
        baseUrl = `${baseUrl}/api`;
    }

    return baseUrl;
}

/**
 * Helper for fetch that throws on non-OK responses to prevent Plotly crashes.
 */
export async function safeFetch(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    return response.json();
}
