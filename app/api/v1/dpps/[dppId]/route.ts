import type { NextRequest } from "next/server";
import { readDppById } from "@/lib/dpp/api";
import { apiOptions, apiResponse } from "@/lib/dpp/api-response";

/**
 * ReadDPPById (EN 18222, Pflicht): GET /api/v1/dpps/{dppId}
 * ReadDPPVersionByIdAndDate (empfohlen): GET /api/v1/dpps/{dppId}?date=YYYY-MM-DD
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ dppId: string }> }) {
  const { dppId } = await params;
  return apiResponse(readDppById(dppId, request.nextUrl.searchParams.get("date")));
}

export const OPTIONS = apiOptions;
