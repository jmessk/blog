import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, inArray, sql } from "drizzle-orm";

import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { PostMeta, Tag } from "@/types/post";
import { parse } from "@/utils/markdown/a";


export async function GET(request: NextRequest): Promise<NextResponse<PostMeta[]>> {
  const { env } = getCloudflareContext();
  const postsDb = drizzle(env.POSTS_DB);

  // クエリパラメータからタグを取得
  const tagsNames = request
    .nextUrl
    .searchParams
    .get("tags")?.split(",") || [];

  const tagIds = tagsNames.map(tag => tag
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("-", "")
    .replaceAll("_", "")
  );

  const rows = await postsDb
    .select({
      postId: postsTable.id,
      postTitle: postsTable.title,
      postDescription: postsTable.description,
      postThumbnailUrl: postsTable.thumbnail_url,
      postContent: postsTable.content,
      postCreatedAt: postsTable.created_at,
      postUpdatedAt: postsTable.updated_at,
      postDeletedAt: postsTable.deleted_at,
      tags: sql<Array<Tag>>`json_group_array(
        json_object(
          'id', ${tagsTable.id},
          'name', ${tagsTable.name},
          'icon_url', ${tagsTable.icon_url}
        )
      )`.as("tags"),
    })
    .from(postsTable)
    .innerJoin(postTagsTable, eq(postsTable.id, postTagsTable.post_id))
    .innerJoin(tagsTable, eq(tagsTable.id, postTagsTable.tag_id))
    .where(and(isNull(postsTable.deleted_at), inArray(tagsTable.name, tagIds)))
    .groupBy(postsTable.id);

  const posts: PostMeta[] = rows.map(row => ({
    id: row.postId,
    title: row.postTitle,
    description: row.postDescription || undefined,
    thumbnail_url: row.postThumbnailUrl || undefined,
    created_at: row.postCreatedAt,
    updated_at: row.postUpdatedAt || undefined,
    deleted_at: row.postDeletedAt || undefined,
    tags: row.tags,
  }));

  return NextResponse.json(posts);
};

// `POST /api/posts`
// 
// Request:
//
// ```plaintext
// Content-Type: multipart/form-data; boundary=boundary
//
// --boundary
// Content-Disposition: form-data; name="content"
// Content-Type: application/plaintext
//
// # New Post
//
// This is new post.
// --boundary
// Content-Disposition: form-data; name="files"; filename="diagram.png"
// Content-Type: image/png
//
// (binary...)
// --boundary--
// ```
//
// Response:
//
// ```json
// {
//     "id": "<UUID>", 
//     "created_at": "2023-10-01T12:00:00Z",
//     "registered_content": "# Test Post\n\nThis is a test post.",
// }
// ```
export async function POST(request: NextRequest) {
  const { env } = getCloudflareContext();
  const postsDb = drizzle(env.POSTS_DB);

  let content;
  let files;

  try {
    const form = await request.formData();
    const validated = validateFormData(form);

    content = validated.content;
    files = validated.files;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const { frontmatter, imagePaths } = parse(content);

  if (frontmatter.title === undefined) {
    return NextResponse.json({ error: "`title` is required in frontmatter" }, { status: 400 });
  }

  if (frontmatter.thumbnail_url) imagePaths.push(frontmatter.thumbnail_url);

  const relativeImagePaths = imagePaths
    .filter((path) => isRelativeUrl(path))
    .map((path) => path.replace(/^\/+/, ""));
}

function validateFormData(form: FormData) {
  // validate the markdown content
  const content = form.get("content");

  if (!content) throw new Error("`name=content` is required in form-data");
  if (typeof content !== "string") throw new Error("`name=content` must be a string");

  // validate the files
  const files = form.getAll("files").map((file) => {
    if (!(file instanceof File)) return null;
    if (!file.name) return null;
    return {
      name: file.name,
      type: file.type,
      size: file.size,
    };
  });

  if (files.includes(null)) throw new Error("`filename` is required for all form-data files");

  return {
    content,
    files: files as { name: string; type: string; size: number; }[],
  }
}

function isRelativeUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.origin === "null";
  } catch {
    return true;
  }
}
