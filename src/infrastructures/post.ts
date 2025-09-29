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
      thumbnail_url: postsTable.thumbnail_uri,
      category: postsTable.category,
      content: withContent ? postsTable.content : sql`NULL`.as("content"),
      created_at: postsTable.created_at,
      updated_at: postsTable.updated_at,
      deleted_at: postsTable.deleted_at,
      tags: sql<string>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'name', ${tagsTable.name},
              'icon_uri', ${tagsTable.icon_uri},
              'category', ${tagsTable.category}
            )
          )
        END`
        .as("tags"),
    })
    .from(postsTable)
    .where(and(eq(postsTable.id, id), isNull(postsTable.deleted_at)))
    .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.post_id))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tag_id))
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
    thumbnail_uri: dbPost.thumbnail_url ?? undefined,
    category: dbPost.category,
    created_at: dbPost.created_at,
    updated_at: dbPost.updated_at ?? undefined,
    deleted_at: dbPost.deleted_at ?? undefined,
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
      thumbnail_url: postsTable.thumbnail_uri,
      category: postsTable.category,
      created_at: postsTable.created_at,
      updated_at: postsTable.updated_at,
      deleted_at: postsTable.deleted_at,
      tags: sql<string>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'name', ${tagsTable.name},
              'icon_uri', ${tagsTable.icon_uri},
              'category', ${tagsTable.category}
            )
          )
        END`
        .as("tags"),
    })
    .from(postsTable)
    .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.post_id))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tag_id))
    .where(
      tagIds.length === 0
        ? and(
          isNull(postsTable.deleted_at),
          category ? eq(postsTable.category, category) : sql`1=1`
        )
        : and(
          isNull(postsTable.deleted_at),
          category ? eq(postsTable.category, category) : sql`1=1`,
          exists(
            db
              .select()
              .from(postTagsTable)
              .where(
                and(
                  eq(postTagsTable.post_id, postsTable.id),
                  inArray(postTagsTable.tag_id, tagIds)
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
    thumbnail_uri: row.thumbnail_url ?? undefined,
    category: row.category,
    created_at: row.created_at,
    updated_at: row.updated_at ?? undefined,
    deleted_at: row.deleted_at ?? undefined,
    tags: JSON.parse(row.tags) as Tag[],
  } satisfies PostMeta));
}
