import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, inArray, sql, exists } from "drizzle-orm";
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
    .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.post_id))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tag_id))
    .where(
      tagIds.length === 0
        ? isNull(postsTable.deleted_at)
        : and(
          isNull(postsTable.deleted_at),
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

  return NextResponse.json(rows as PostMeta[]);
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
  const createdAt = new Date().toISOString();

  const newTags = normalizeTags(frontmatter.tags || []);
  const newFrontmatter = updateFrontmatter(
    frontmatter,
    id, newTags, createdAt, urlMap
  );
  const newContent = replacePaths(content, urlMap);
  const newMarkdown = rebuildMarkdown(newFrontmatter, newContent);

  await db.insert(postsTable).values({
    id,
    title: newFrontmatter.title!,
    description: newFrontmatter.description!,
    thumbnail_url: newFrontmatter.thumbnail_url!,
    created_at: createdAt,
    content: newContent,
  }).run();

  // もし存在しないタグがあれば追加
  await db.insert(tagsTable).values(
    newTags.map((tag) => ({
      id: tag,
      name: tag,
    }))
  ).onConflictDoNothing().run();

  // Post と Tag の関連付けを追加
  await db.insert(postTagsTable).values(
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
