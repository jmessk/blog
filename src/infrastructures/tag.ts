import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, sql } from "drizzle-orm";

import { tagsTable } from "@/db/schema";
import { Tag } from "@/types/post";


export async function getTags(category?: string): Promise<Tag[]> {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: tagsTable.id,
      name: tagsTable.name,
      icon_url: tagsTable.icon_uri,
      category: tagsTable.category,
    })
    .from(tagsTable)
    .where(category ? eq(tagsTable.category, category) : sql`1=1`)
    .orderBy(tagsTable.name);

  return rows as Tag[];
}
