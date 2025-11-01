import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

import { postTagsTable } from "@/db/schema";


export async function insertPostTags(postId: string, tagIds: string[]) {
  if (tagIds.length === 0) { return; }

  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  await db.insert(postTagsTable).values(
    tagIds.map((tagId) => ({
      post_id: postId,
      tag_id: tagId,
    }))
  ).onConflictDoNothing().run();
}


export async function deletePostTags(postId: string) {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);
  await db.delete(postTagsTable).where(eq(postTagsTable.post_id, postId)).run();
}
