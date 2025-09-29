import { NextRequest, NextResponse } from "next/server";

import { Tag } from "@/types/post";
import { getTags } from "@/infrastructures/tag";


export async function GET(request: NextRequest): Promise<NextResponse<Tag[]>> {
  const category = request.nextUrl.searchParams.get("category") ?? undefined;
  const tags = await getTags(category);
  return NextResponse.json(tags);
}
