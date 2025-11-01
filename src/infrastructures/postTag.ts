import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

import { postTagsTable } from "@/db/schema";


export async function insertPostTags(postId: string, tagIds: string[]) {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  await db.insert(postTagsTable).values(
    tagIds.map((tagId) => ({
      postId: postId,
      tagId: tagId,
    }))
  ).onConflictDoNothing().run();
}


export async function deletePostTags(postId: string) {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);
  await db.delete(postTagsTable).where(eq(postTagsTable.postId, postId)).run();
}
