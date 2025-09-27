import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { URL } from "url";
import { uuidv7 } from "uuidv7";
import { postsTable, tagsTable, postTagsTable } from "@/db/schema";
import { FrontMatter, PostMeta } from "@/types/post";
import { extractContents } from "@/utils/markdown/extract";
import { replacePaths } from "@/utils/markdown/replace";
import { rebuildMarkdown } from "@/utils/markdown/rebuild";
import { uploadImage } from "@/infrastructures/image";
import { normalizeTags } from "@/utils/tag";
import { getPosts } from "@/infrastructures/post";


export async function GET(request: NextRequest): Promise<NextResponse<PostMeta[]>> {
  const tagsNames = request.nextUrl.searchParams.get("tags")?.split(",") ?? [];
  const tagIds = normalizeTags(tagsNames);

  const posts = await getPosts(tagIds);

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

    // const mdFileNames = extractPathFileNames(imagePaths);
    const mdImagePaths = imagePaths.filter((imagePath: string) => !isUrl(imagePath));

    if (!checkAllFilesExist(mdImagePaths, files)) {
      throw new Error("Some files are referenced in markdown, but not uploaded");
    }

    const fileMap = makeFileMap(mdImagePaths, files);
    urlMap = await uploadAndMakeMap(fileMap);

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
    thumbnail_uri: newFrontmatter.thumbnail_uri!,
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

// function extractPathFileNames(paths: string[]): string[] {
//   return paths
//     .filter((path) => !isUrl(path))
//     .map((imagePath) => path.basename(imagePath));
// }

function checkAllFilesExist(filePaths: string[], files: File[]): boolean {
  return filePaths
    .map((filename) => path.basename(filename))
    .every((filename) =>
      files.some((file) => file.name === filename)
    );
}

function makeFileMap(filePaths: string[], files: File[]): Record<string, File> {
  const fileMap = filePaths
    // only include the files that are actually referenced in markdown
    // .filter((fileName) => files.find((file) => file.name === fileName))

    // create a map of filename -> File
    .reduce((map, filePath) => {
      const fileName = path.basename(filePath);
      const file = files.find((file) => file.name === fileName);

      if (file) {
        map[filePath] = file;
      }

      return map;
    }, {} as Record<string, File>);

  return fileMap;
}

async function uploadAndMakeMap(fileMap: Record<string, File>): Promise<Record<string, string>> {
  const urlMap: Record<string, string> = {};

  const uploadings = Object.entries(fileMap)
    .map(async ([filePath, file]) => {
      const uploadedPath = await uploadImage(file);
      if (uploadedPath) {
        urlMap[filePath] = uploadedPath;
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
  frontmatter.tags = tags;

  if (frontmatter.thumbnail_uri) {
    frontmatter.thumbnail_uri = urlMap[frontmatter.thumbnail_uri];
  }

  return frontmatter;
}
