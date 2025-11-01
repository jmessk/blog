import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

import { postObjectsTable } from "@/db/schema";


export async function insertPostObjects(postId: string, objectNames: string[]) {
  if (objectNames.length === 0) { return; }

  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  await db.insert(postObjectsTable).values(
    objectNames.map((objectName) => ({
      post_id: postId,
      object_key: objectName,
    }))
  );
}


export async function getPostObjectKeys(postId: string): Promise<string[]> {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select()
    .from(postObjectsTable)
    .where(eq(postObjectsTable.post_id, postId))
    .all();

  return rows.map((row) => row.object_key);
}


export async function deletePostObjects(postId: string) {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  await db.delete(postObjectsTable).where(eq(postObjectsTable.post_id, postId)).run();
}
