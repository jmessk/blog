import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, sql } from "drizzle-orm";

import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { PostMeta, Tag } from "@/types/post";


export async function GET(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
  const { env } = getCloudflareContext();
  const { post_id } = await params;
  const isContentEnabled = request.nextUrl.searchParams.get("content") === "true";

  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      description: postsTable.description,
      thumbnail_url: postsTable.thumbnail_url,
      content: isContentEnabled ? postsTable.content : sql`NULL`.as("content"),
      created_at: postsTable.created_at,
      updated_at: postsTable.updated_at,
      deleted_at: postsTable.deleted_at,
      tags: sql<Array<Tag>>`
        CASE
          WHEN COUNT(${tagsTable.id}) = 0 THEN json('[]')
          ELSE json_group_array(
            json_object(
              'id', ${tagsTable.id},
              'name', ${tagsTable.name},
              'icon_url', ${tagsTable.icon_url}
            )
          )
        END`
        .as("tags"),
    })
    .from(postsTable)
    .where(and(eq(postsTable.id, post_id), isNull(postsTable.deleted_at)))
    .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.post_id))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tag_id))
    .groupBy(postsTable.id)
    .limit(1);

  if (!(rows && rows[0])) {
    return NextResponse.json({ error: `"post_id ${post_id} is not found"` }, { status: 404 });
  }

  const post = rows[0];

  post.tags = JSON.parse(post.tags as unknown as string) as Tag[];

  return NextResponse.json(post as PostMeta);
}
