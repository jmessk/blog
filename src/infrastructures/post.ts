import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, sql, inArray, exists } from "drizzle-orm";

import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { Post, PostMeta, Tag } from "@/types/post";


// Overload signatures
export async function getPost(params: { id: string; withContent: true }): Promise<Post>;
export async function getPost(params: { id: string; withContent: false }): Promise<PostMeta>;
export async function getPost(params: { id: string; withContent: boolean }): Promise<Post | PostMeta>;
export async function getPost({ id, withContent }: { id: string; withContent: boolean }): Promise<Post | PostMeta> {
  const { env } = getCloudflareContext();

  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      description: postsTable.description,
      category: postsTable.category,
      thumbnail_uri: postsTable.thumbnailUri,
      content: withContent ? postsTable.content : sql`NULL`.as("content"),
      created_at: postsTable.createdAt,
      updated_at: postsTable.updatedAt,
      deleted_at: postsTable.deletedAt,
      tags: sql<string>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'category', ${postsTable.category},
              'name', ${tagsTable.name},
              'icon_uri', ${tagsTable.iconUri}
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
    throw new Error(`post_id ${id} is not found`);
  }

  const dbPost = rows[0];

  const meta: PostMeta = {
    id: dbPost.id,
    title: dbPost.title,
    description: dbPost.description ?? undefined,
    category: dbPost.category,
    thumbnailUri: dbPost.thumbnail_uri ?? undefined,
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at ?? undefined,
    deletedAt: dbPost.deleted_at ?? undefined,
    tags: JSON.parse(dbPost.tags) as Tag[],
  };

  if (withContent) {
    return { ...meta, content: dbPost.content as string } satisfies Post;
  }

  return meta;
}

type GetPostsParams = {
  category?: string;
  tagIds?: string[];
}

// Get multiple posts optionally filtered by tag names (normalized externally)
export async function getPosts({ category, tagIds = [] }: GetPostsParams): Promise<PostMeta[]> {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      description: postsTable.description,
      thumbnail_uri: postsTable.thumbnailUri,
      category: postsTable.category,
      created_at: postsTable.createdAt,
      updated_at: postsTable.updatedAt,
      deleted_at: postsTable.deletedAt,
      tags: sql<string>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'category', ${postsTable.category},
              'name', ${tagsTable.name},
              'icon_uri', ${tagsTable.iconUri}
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
    thumbnailUri: row.thumbnail_uri ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
    deletedAt: row.deleted_at ?? undefined,
    tags: JSON.parse(row.tags) as Tag[],
  } satisfies PostMeta));
}
