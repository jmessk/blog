import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, sql, inArray, exists } from "drizzle-orm";

import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { Post, PostMeta, Tag } from "@/types/post";


export async function getPostContent(id: string): Promise<string | null> {
  const { env } = getCloudflareContext();
  const content = await env.R2_BUCKET.get(`${id}.md`);
  return content ? await content.text() : null;
}


export async function putPostContent(id: string, content: string): Promise<void> {
  const { env } = getCloudflareContext();

  await env.R2_BUCKET.put(`${id}.md`, content, {
    httpMetadata: {
      contentType: "text/plain",
    },
  });
}


export async function updatePostContent(id: string, content: string): Promise<void> {
  const { env } = getCloudflareContext();

  const existing = await env.R2_BUCKET.get(`${id}.md`);
  if (!existing) {
    throw new Error(`post content for id ${id} is not found`);
  }

  await env.R2_BUCKET.put(`${id}.md`, content, {
    httpMetadata: {
      contentType: "text/plain",
    },
  });
}


export async function getPostMeta(id: string): Promise<PostMeta | null> {
  const { env } = getCloudflareContext();

  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      description: postsTable.description,
      category: postsTable.category,
      thumbnailUri: postsTable.thumbnailUri,
      // content: withContent ? postsTable.content : sql`NULL`.as("content"),
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      deletedAt: postsTable.deletedAt,
      tags: sql<string>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'category', ${tagsTable.category},
              'name', ${tagsTable.name},
              'iconUri', ${tagsTable.iconUri}
            )
          )
        END`
        .as("tags"),
    })
    .from(postsTable)
    .where(and(eq(postsTable.id, id), isNull(postsTable.deletedAt)))
    .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.postId))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tagId))
    .groupBy(postsTable.id)
    .limit(1);

  if (!(rows && rows[0])) {
    // throw new Error(`post_id ${id} is not found`);
    return null;
  }

  const dbPost = rows[0];

  const meta: PostMeta = {
    id: dbPost.id,
    title: dbPost.title,
    description: dbPost.description ?? undefined,
    category: dbPost.category,
    thumbnailUri: dbPost.thumbnailUri ?? undefined,
    createdAt: dbPost.createdAt,
    updatedAt: dbPost.updatedAt ?? undefined,
    deletedAt: dbPost.deletedAt ?? undefined,
    tags: JSON.parse(dbPost.tags) as Tag[],
  };

  return meta;
}

type GetPostsParams = {
  category?: string;
  tagIds?: string[];
}

// Get multiple posts optionally filtered by tag names (normalized externally)
export async function getPostMetaList({ category, tagIds = [] }: GetPostsParams): Promise<PostMeta[]> {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      description: postsTable.description,
      thumbnailUri: postsTable.thumbnailUri,
      category: postsTable.category,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      deletedAt: postsTable.deletedAt,
      tags: sql<string>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'category', ${tagsTable.category},
              'name', ${tagsTable.name},
              'iconUri', ${tagsTable.iconUri}
            )
          )
        END`
        .as("tags"),
    })
    .from(postsTable)
    .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.postId))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tagId))
    .where(
      tagIds.length === 0
        ? and(
          isNull(postsTable.deletedAt),
          category ? eq(postsTable.category, category) : sql`1=1`
        )
        : and(
          isNull(postsTable.deletedAt),
          category ? eq(postsTable.category, category) : sql`1=1`,
          exists(
            db
              .select()
              .from(postTagsTable)
              .where(
                and(
                  eq(postTagsTable.postId, postsTable.id),
                  inArray(postTagsTable.tagId, tagIds)
                )
              )
          )
        )
    )
    .groupBy(postsTable.id);

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    category: row.category,
    thumbnailUri: row.thumbnailUri ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt ?? undefined,
    deletedAt: row.deletedAt ?? undefined,
    tags: JSON.parse(row.tags) as Tag[],
  } satisfies PostMeta));
}
