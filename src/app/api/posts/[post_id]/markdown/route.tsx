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
      thumbnail_url: postsTable.thumbnail_url,
      content: postsTable.content,
      created_at: postsTable.created_at,
      updated_at: postsTable.updated_at,
      deleted_at: postsTable.deleted_at,
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

  const post = rows[0];

  const content = post.content;
  const frontmatter = {
    id: post.id,
    title: post.title,
    description: post.description ?? undefined,
    thumbnail_url: post.thumbnail_url ?? undefined,
    created_at: post.created_at,
    updated_at: post.updated_at ?? undefined,
    deleted_at: post.deleted_at ?? undefined,
    tags: post.tags ? JSON.parse(post.tags) as string[] : undefined
  } as FrontMatter;

  const markdown = rebuildMarkdown(frontmatter, content);

  return new NextResponse(markdown);
}
