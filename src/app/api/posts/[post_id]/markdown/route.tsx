import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, sql } from "drizzle-orm";

import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { FrontMatter } from "@/types/post";
import { rebuildMarkdown } from "@/utils/markdown/rebuild";


export async function GET(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
  const { env } = getCloudflareContext();
  const { post_id } = await params;

  const db = drizzle(env.D1_POSTS);

  const rows = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      description: postsTable.description,
      category: postsTable.category,
      thumbnail_uri: postsTable.thumbnailUri,
      content: postsTable.content,
      created_at: postsTable.createdAt,
      updated_at: postsTable.updatedAt,
      deleted_at: postsTable.deletedAt,
      tags: sql<string | null>`json_group_array(${tagsTable.id})`.as("tags"),
    })
    .from(postsTable)
    .where(and(eq(postsTable.id, post_id), isNull(postsTable.deletedAt)))
    .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.postId))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tagId))
    .groupBy(postsTable.id)
    .limit(1);

  if (!(rows && rows[0])) {
    return NextResponse.json({ error: `"post_id ${post_id} is not found"` }, { status: 404 });
  }

  const post = rows[0];

  const content = post.content;
  const frontmatter = {
    id: post.id,
    title: post.title,
    description: post.description ?? undefined,
    category: post.category,
    thumbnailUri: post.thumbnail_uri ?? undefined,
    createdAt: post.created_at,
    updatedAt: post.updated_at ?? undefined,
    deletedAt: post.deleted_at ?? undefined,
    tags: post.tags ? JSON.parse(post.tags) as string[] : undefined
  } as FrontMatter;

  const markdown = rebuildMarkdown(frontmatter, content);

  return new NextResponse(markdown);
}
