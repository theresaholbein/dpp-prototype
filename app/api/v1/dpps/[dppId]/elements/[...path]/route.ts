import type { NextRequest } from "next/server";
import { readDataElement } from "@/lib/dpp/api";
import { apiOptions, apiResponse } from "@/lib/dpp/api-response";

/** ReadDataElement (EN 18222, empfohlen): GET /api/v1/dpps/{dppId}/elements/{templateId}/{key}[?date=YYYY-MM-DD] */
export async function GET(request: NextRequest, { params }: { params: Promise<{ dppId: string; path: string[] }> }) {
  const { dppId, path } = await params;
  return apiResponse(readDataElement(dppId, path.join("/"), request.nextUrl.searchParams.get("date")));
}

export const OPTIONS = apiOptions;
