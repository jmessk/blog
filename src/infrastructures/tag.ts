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
      category: tagsTable.category,
      name: tagsTable.name,
      iconUri: tagsTable.iconUri,
    })
    .from(tagsTable)
    .where(category ? eq(tagsTable.category, category) : sql`1=1`)
    .orderBy(tagsTable.name);

  return rows as Tag[];
}


export async function insertTags(tags: Tag[]) {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  await db.insert(tagsTable).values(
    tags.map((tag) => ({
      id: tag.id,
      category: tag.category,
      name: tag.name,
      iconUri: tag.iconUri ?? null,
    }))
  ).onConflictDoNothing().run();
}
