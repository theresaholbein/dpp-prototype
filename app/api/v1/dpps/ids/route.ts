import { readDppIdsByProductIds } from "@/lib/dpp/api";
import { apiOptions, apiResponse } from "@/lib/dpp/api-response";

/** ReadDPPIdsByProductIds (EN 18222, Pflicht): POST /api/v1/dpps/ids mit { "productIds": [...] } */
export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // Ungültiges JSON: readDppIdsByProductIds antwortet mit 400.
  }
  return apiResponse(readDppIdsByProductIds(body));
}

export const OPTIONS = apiOptions;
