import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, inArray, sql } from "drizzle-orm";
import path from "path";

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

  // フォームが正しいか検証
  let validated;
  try {
    const form = await request.formData();
    validated = validateFormData(form);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  // これから利用する素材
  const { markdown, files } = validated;
  const { content, frontmatter, imagePaths } = parse(markdown);

  // frontmatterの `title` が存在するか検証
  if (!frontmatter.title) {
    return NextResponse.json(
      { error: "`title` does not exists in frontmatter" },
      { status: 400 });
  }

  const mdFileNames = imagePaths
    .filter((path) => !isUrl(path))
    .map((imagePath) => path.basename(imagePath));

  // markdown内で参照されているファイルが全てアップロードされているか検証
  let fileMap: Record<string, File>;
  try {
    fileMap = validateMarkdownFiles(mdFileNames, files);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  
}

function validateFormData(form: FormData) {
  // validate the markdown content
  const markdown = form.get("content");

  if (!markdown) throw new Error("`name=content` is required in form-data");
  if (typeof markdown !== "string") throw new Error("`name=content` must be a string");

  // validate the files
  const files = form.getAll("files").map((file) => {
    if (!((file instanceof File) && file.name)) {
      throw new Error("`filename` is required for all form-data files");
    }

    const newName = path.basename(file.name);
    return new File([file], newName);
  });

  return { markdown, files }
}

function isUrl(value: string) {
  try {
    const parsed = new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validateMarkdownFiles(imagePaths: string[], files: File[]): Record<string, File> {
  // markdown内で参照されているファイル名一覧
  const mdFileNames = imagePaths
    .filter((path) => !isUrl(path))
    .map((imagePath) => path.basename(imagePath));

  // markdown内で参照されているファイルが全てアップロードされているか検証
  const formFileNames = files.map((file) => file.name);
  mdFileNames.forEach((filename) => {
    if (!formFileNames.includes(filename)) {
      throw new Error(`"${filename}" is referenced in markdown, but not uploaded`);
    }
  });

  const fileMap = mdFileNames
    .filter((filename) => files.find((file) => file.name === filename)!)
    .reduce((map, filename) => {
      const file = files.find((file) => file.name === filename)!;
      map[filename] = file;
      return map;
    }, {} as Record<string, File>);

  return fileMap;
}
