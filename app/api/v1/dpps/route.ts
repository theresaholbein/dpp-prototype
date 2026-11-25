import type { NextRequest } from "next/server";
import { readDppByProductId } from "@/lib/dpp/api";
import { apiOptions, apiResponse } from "@/lib/dpp/api-response";

/** ReadDPPByProductId (EN 18222, Pflicht): GET /api/v1/dpps?productId={upi} */
export function GET(request: NextRequest) {
  return apiResponse(readDppByProductId(request.nextUrl.searchParams.get("productId")));
}

export const OPTIONS = apiOptions;
