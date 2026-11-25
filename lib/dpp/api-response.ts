import type { ApiResult } from "./api.ts";

/**
 * JSON-Antwort der Lese-API (SPEC §7). Nur JSON im MVP; XML/JSON-LD sind optional (§12).
 * Öffentliche Leseschnittstelle, daher CORS für alle Ursprünge.
 */
export const API_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export function apiResponse<T>(result: ApiResult<T>): Response {
  if (result.ok) return Response.json(result.data, { headers: API_HEADERS });
  return Response.json({ error: result.error }, { status: result.status, headers: API_HEADERS });
}

export function apiOptions(): Response {
  return new Response(null, { status: 204, headers: API_HEADERS });
}
