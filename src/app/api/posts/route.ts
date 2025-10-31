import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { URL } from "url";
import { uuidv7 } from "uuidv7";

import { postsTable, tagsTable, postTagsTable, postObjectsTable } from "@/db/schema";
import { FrontMatter, PostMeta } from "@/types/post";
import { extractContents } from "@/utils/markdown/extract";
import { replacePaths } from "@/utils/markdown/replace";
import { rebuildMarkdown } from "@/utils/markdown/rebuild";
import { putImage } from "@/infrastructures/image";
import { normalizeTags } from "@/utils/tag";
import { normalizeCategory } from "@/utils/category";
import { getPostMetaList, putPostContent } from "@/infrastructures/post";
import { UrlMap } from "@/types/helper";


export async function GET(request: NextRequest) {
  const categoryParam = request.nextUrl.searchParams.get("category");
  const tagsParam = request.nextUrl.searchParams.get("tags")?.split(",");

  const category = categoryParam ? normalizeCategory(categoryParam) : undefined;
  const tagIds = tagsParam ? normalizeTags(tagsParam) : undefined;
  const posts = await getPostMetaList({ category, tagIds });

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

  const authorization = request.headers.get("authorization") ?? "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  const providedToken = tokenMatch?.[1];
  const expectedToken = env.POSTS_API_TOKEN;

  if (!expectedToken) {
    console.error("POSTS_API_TOKEN is not configured in the environment");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  if (!providedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



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
    // frontmatterの `category` が存在するか検証
    if (!frontmatter.category) {
      throw new Error("`category` does not exists in frontmatter");
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



  const db = drizzle(env.D1_POSTS);

  const id = uuidv7();
  const createdAt = new Date().toISOString();
  const newCategory = normalizeCategory(frontmatter.category!);
  const newTags = normalizeTags(frontmatter.tags || []);

  const newFrontmatter = updateFrontmatter(
    frontmatter,
    // id, newCategory, newTags, createdAt,
    { id, category: newCategory, tags: newTags, createdAt },
    urlMap
  );

  const newContent = replacePaths(content, urlMap);
  const newMarkdownToReturn = rebuildMarkdown(newFrontmatter, newContent);



  await putPostContent(id, newContent);

  await db.insert(postsTable).values({
    id,
    title: newFrontmatter.title!,
    description: newFrontmatter.description!,
    category: newCategory,
    thumbnailUri: newFrontmatter.thumbnailUri!,
    createdAt: createdAt,
  }).run();

  await db.insert(tagsTable).values(
    newTags.map((tag) => ({
      id: tag,
      category: newCategory,
      name: tag,
    }))
  ).onConflictDoNothing().run();

  await db.insert(postTagsTable).values(
    newTags.map((tag) => ({
      postId: id,
      tagId: tag,
    }))
  ).onConflictDoNothing().run();

  await db.insert(postObjectsTable).values(
    Object.values(urlMap).map(({ filename }) => ({
      postId: id,
      objectName: filename,
    }))
  );

  return NextResponse.json({
    id,
    created_at: createdAt,
    registered_content: newMarkdownToReturn,
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

async function uploadAndMakeMap(fileMap: Record<string, File>): Promise<UrlMap> {
  const urlMap: UrlMap = {};

  const uploadings = Object.entries(fileMap)
    .map(async ([filePath, file]) => {
      const filename = await putImage(file);
      const uploadedPath = `/api/images/${filename}`;
      if (uploadedPath) {
        urlMap[filePath] = { filename, uri: uploadedPath };
      }
    });

  await Promise.all(uploadings);

  return urlMap;
}

function updateFrontmatter(
  prevFrontmatter: FrontMatter,
  // id: string,
  // category: string,
  // tags: string[],
  // createdAt: string,
  newFrontmatter: FrontMatter,
  urlMap: UrlMap
): FrontMatter {
  // prevFrontmatter.id = id;
  // prevFrontmatter.createdAt = createdAt;
  // prevFrontmatter.category = category;
  // prevFrontmatter.tags = tags;
  const updatedFrontmatter = Object.assign(prevFrontmatter, newFrontmatter);
  
  if (updatedFrontmatter.thumbnailUri) {
    updatedFrontmatter.thumbnailUri = urlMap[updatedFrontmatter.thumbnailUri].uri;
  }
  console.log("Updated frontmatter:", updatedFrontmatter);
  console.log("URL map:", urlMap);

  return updatedFrontmatter;
}
