import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, inArray, sql } from "drizzle-orm";
import path from "path";
import { URL } from "url";
import { uuidv7 } from "uuidv7";

import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { FrontMatter, PostMeta, Tag } from "@/types/post";
import { extractContents } from "@/utils/markdown/extract";
import { replacePaths } from "@/utils/markdown/replace";
import { rebuildMarkdown } from "@/utils/markdown/rebuild";
import { uploadImage } from "@/utils/image";
import { normalizeTags } from "@/utils/tag";


export async function GET(request: NextRequest): Promise<NextResponse<PostMeta[]>> {
  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  // クエリパラメータからタグを取得
  const tagsNames = request
    .nextUrl
    .searchParams
    .get("tags")?.split(",") || [];

  const tagIds = normalizeTags(tagsNames);

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
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    thumbnail_url: row.thumbnail_url || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at || undefined,
    deleted_at: row.deleted_at || undefined,
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
  const form = await request.formData();

  let content;
  let frontmatter;
  let urlMap;

  try {
    const { markdown, files } = validateFormData(form);

    let imagePaths;
    ({ content, frontmatter, imagePaths } = extractContents(markdown));

    // frontmatterの `title` が存在するか検証
    if (!frontmatter.title) {
      throw new Error("`title` does not exists in frontmatter");
    }

    const mdFileNames = extractPathFileNames(imagePaths);

    if (!checkAllFilesExist(mdFileNames, files)) {
      throw new Error("Some files are referenced in markdown, but not uploaded");
    }

    const fileMap = makeFileMap(mdFileNames, files);
    urlMap = await makeUrlMap(fileMap);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  const db = drizzle(env.D1_POSTS);

  const id = uuidv7();
  const createdAt = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });

  const newTags = normalizeTags(frontmatter.tags || []);
  const newFrontmatter = updateFrontmatter(frontmatter, id, newTags, createdAt, urlMap);
  const newContent = replacePaths(content, urlMap);
  const newMarkdown = rebuildMarkdown(newFrontmatter, newContent);

  db.insert(postsTable).values({
    id,
    title: newFrontmatter.title!,
    description: newFrontmatter.description!,
    thumbnail_url: newFrontmatter.thumbnail_url!,
    created_at: createdAt,
    content: newContent,
  })

  // もし存在しないタグがあれば追加
  db.insert(tagsTable).values(
    newTags.map((tag) => ({
      id: tag,
      name: tag,
    }))
  ).onConflictDoNothing().run();

  // Post と Tag の関連付けを追加
  db.insert(postTagsTable).values(
    newTags.map((tag) => ({
      post_id: id,
      tag_id: tag,
    }))
  ).onConflictDoNothing().run();

  return NextResponse.json({
    id,
    created_at: createdAt,
    registered_content: newMarkdown,
  });
}

function validateFormData(form: FormData): { markdown: string; files: File[] } {
  // validate the markdown content
  const markdown = form.get("content");

  if (!markdown) throw new Error("`name=content` is required in form-data");
  if (typeof markdown !== "string") throw new Error("`name=content` must be a string");

  // validate the files
  const files = form.getAll("files").map((file) => {
    if (!((file instanceof File) && file.name)) {
      throw new Error("`filename` is required for all form-data files");
    }

    // rename the filename, delete path information
    const newName = path.basename(file.name);
    return new File([file], newName);
  });

  return { markdown, files }
}

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function extractPathFileNames(paths: string[]): string[] {
  return paths
    .filter((path) => !isUrl(path))
    .map((imagePath) => path.basename(imagePath));
}

function checkAllFilesExist(fileNames: string[], files: File[]): boolean {
  return fileNames.every((filename) =>
    files.some((file) => file.name === filename)
  );
}

function makeFileMap(fileNames: string[], files: File[]): Record<string, File> {
  const fileMap = fileNames
    // only include the files that are actually referenced in markdown
    .filter((fileName) => files.find((file) => file.name === fileName))

    // create a map of filename -> File
    .reduce((map, fileName) => {
      const file = files.find((file) => file.name === fileName);

      if (file) {
        map[fileName] = file;
      }

      return map;
    }, {} as Record<string, File>);

  return fileMap;
}

async function makeUrlMap(fileMap: Record<string, File>): Promise<Record<string, string>> {
  const urlMap: Record<string, string> = {};

  const uploadings = Object.entries(fileMap)
    .map(async ([fileName, file]) => {
      const uploadedPath = await uploadImage(file);
      if (uploadedPath) {
        urlMap[fileName] = uploadedPath;
      }
    });

  await Promise.all(uploadings);

  return urlMap;
}

function updateFrontmatter(
  frontmatter: FrontMatter,
  id: string,
  tags: string[],
  createdAt: string,
  urlMap: Record<string, string>
): FrontMatter {
  frontmatter.id = id;
  frontmatter.created_at = createdAt;
  frontmatter.tags = tags

  if (frontmatter.thumbnail_url) {
    const thumbnailFileName = path.basename(frontmatter.thumbnail_url);
    frontmatter.thumbnail_url = urlMap[thumbnailFileName];
  }

  return frontmatter;
}
