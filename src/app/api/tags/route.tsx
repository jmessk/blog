import { NextRequest, NextResponse } from "next/server";

import { Tag } from "@/types/post";
import { getAllTags } from "@/infrastructures/tag";


export async function GET(_request: NextRequest): Promise<NextResponse<Tag[]>> {
  const tags = await getAllTags();
  return NextResponse.json(tags);
}
