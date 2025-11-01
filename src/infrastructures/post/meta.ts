import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, sql, inArray, exists, desc } from "drizzle-orm";

import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { Post, PostMeta, Tag } from "@/types/post";


export async function getPostMeta(id: string): Promise<PostMeta | null> {
  const { env } = getCloudflareContext();

  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      description: postsTable.description,
      category: postsTable.category,
      thumbnailUri: postsTable.thumbnail_uri,
      // content: withContent ? postsTable.content : sql`NULL`.as("content"),
      createdAt: postsTable.created_at,
      updatedAt: postsTable.updated_at,
      deletedAt: postsTable.deleted_at,
      tags: sql<string>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'category', ${tagsTable.category},
              'label', ${tagsTable.label},
              'icon_uri', ${tagsTable.icon_uri}
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
    // throw new Error(`post_id ${id} is not found`);
    return null;
  }

  const dbPost = rows[0];

  const meta: PostMeta = {
    id: dbPost.id,
    title: dbPost.title,
    description: dbPost.description ?? undefined,
    category: dbPost.category,
    thumbnail_uri: dbPost.thumbnailUri ?? undefined,
    created_at: dbPost.createdAt,
    updated_at: dbPost.updatedAt ?? undefined,
    deleted_at: dbPost.deletedAt ?? undefined,
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
      thumbnailUri: postsTable.thumbnail_uri,
      category: postsTable.category,
      createdAt: postsTable.created_at,
      updatedAt: postsTable.updated_at,
      deletedAt: postsTable.deleted_at,
      tags: sql<string>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'category', ${tagsTable.category},
              'label', ${tagsTable.label},
              'icon_uri', ${tagsTable.icon_uri}
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
    .groupBy(postsTable.id)
    .orderBy(
      desc(sql`COALESCE(${postsTable.updated_at}, ${postsTable.created_at})`)
    );

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    category: row.category,
    thumbnail_uri: row.thumbnailUri ?? undefined,
    created_at: row.createdAt,
    updated_at: row.updatedAt ?? undefined,
    deleted_at: row.deletedAt ?? undefined,
    tags: JSON.parse(row.tags) as Tag[],
  } satisfies PostMeta));
}


export async function insertPostMeta(meta: PostMeta) {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);
  await db.insert(postsTable).values({ ...meta }).run();
}


export async function updatePostMeta(meta: Partial<PostMeta>) {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);
  await db.update(postsTable).set({ ...meta }).where(eq(postsTable.id, meta.id!)).run();
}
