import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, sql } from "drizzle-orm";

import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { FrontMatter } from "@/types/post";
import { rebuildMarkdown } from "@/utils/markdown/rebuild";
import { getPostContent } from "@/infrastructures/post/content";


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
      thumbnailUri: postsTable.thumbnail_uri,
      // content: postsTable.content,
      createdAt: postsTable.created_at,
      updatedAt: postsTable.updated_at,
      deletedAt: postsTable.deleted_at,
      tags: sql<string | null>`json_group_array(${tagsTable.id})`.as("tags"),
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

  const content = await getPostContent(post_id);
  if (!content) {
    return NextResponse.json({ error: `content for post_id ${post_id} is not found` }, { status: 404 });
  }

  const post = rows[0];
  const frontmatter = {
    id: post.id,
    title: post.title,
    description: post.description ?? undefined,
    category: post.category,
    thumbnail_uri: post.thumbnailUri ?? undefined,
    created_at: post.createdAt,
    updated_at: post.updatedAt ?? undefined,
    deleted_at: post.deletedAt ?? undefined,
    tags: post.tags ? JSON.parse(post.tags) as string[] : undefined
  } as FrontMatter;

  const markdown = rebuildMarkdown(frontmatter, content);

  return new NextResponse(markdown);
}
