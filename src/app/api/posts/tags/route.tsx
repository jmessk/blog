import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

import { tagsTable } from "@/db/schema";
import { Tag } from "@/types/post";


export async function GET(_request: NextRequest): Promise<NextResponse<Tag[]>> {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: tagsTable.id,
      name: tagsTable.name,
      icon_url: tagsTable.icon_url,
    })
    .from(tagsTable)
    .orderBy(tagsTable.name);

  return NextResponse.json(rows as Tag[]);
}
