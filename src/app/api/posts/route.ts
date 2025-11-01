import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { uuidv7 } from "uuidv7";

import { extractContents } from "@/utils/markdown/extract";
import { replacePaths } from "@/utils/markdown/replace";
import { rebuildMarkdown } from "@/utils/markdown/rebuild";
import { normalizeTags } from "@/utils/tag";
import { normalizeCategory } from "@/utils/category";
import { getPostMetaList, insertPostMeta } from "@/infrastructures/post/meta";
import { putPostContent } from "@/infrastructures/post/content";
import { insertTags } from "@/infrastructures/tag";
import { insertPostTags } from "@/infrastructures/postTag";
import { insertPostObjects } from "@/infrastructures/postObject";
import {
  checkAllFilesExist,
  isUrl,
  makeFileMap,
  makeUriMap,
  updateFrontmatter,
  validateFormData
} from "@/utils/helper";


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
  let imagePaths;
  let urlMap;

  try {
    const { markdown, files } = validateFormData(form);
    ({ content, frontmatter, imagePaths } = extractContents(markdown));

    // frontmatterの `title` が存在するか検証
    if (!frontmatter.title) {
      throw new Error("`title` does not exists in frontmatter");
    }
    // frontmatterの `category` が存在するか検証
    if (!frontmatter.category) {
      throw new Error("`category` does not exists in frontmatter");
    }

    const uploadedImagePaths = imagePaths.filter((imagePath: string) => !isUrl(imagePath));
    if (!checkAllFilesExist(uploadedImagePaths, files)) {
      throw new Error("Some files are referenced in markdown, but not uploaded");
    }

    const fileMap = makeFileMap(uploadedImagePaths, files);
    urlMap = await makeUriMap(fileMap);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  // const newFrontmatter: FrontMatter = {
  //   ...frontmatter,
  //   id: uuidv7(),
  //   category: normalizeCategory(frontmatter.category!),
  //   thumbnailUri: frontmatter.thumbnailUri
  //     ? urlMap[frontmatter.thumbnailUri]?.uri
  //     : undefined,
  //   tags: normalizeTags(frontmatter.tags || []),
  //   createdAt: new Date().toISOString(),
  // }

  const id = uuidv7();
  const createdAt = new Date().toISOString();
  const newCategory = normalizeCategory(frontmatter.category!);
  const newTags = normalizeTags(frontmatter.tags || []);
  const newFrontmatter = updateFrontmatter(
    frontmatter,
    { id, category: newCategory, tags: newTags, created_at: createdAt },
    urlMap
  );
  const newContent = replacePaths(content, urlMap);

  await Promise.all([
    insertPostMeta({
      id,
      title: newFrontmatter.title!,
      description: newFrontmatter.description!,
      category: newCategory,
      thumbnail_uri: newFrontmatter.thumbnail_uri!,
      created_at: createdAt,
    }),
    await insertTags(newTags.map((tagId) => ({
      id: tagId,
      category: newCategory,
      label: tagId
    }))),
  ]);


  await Promise.all([
    insertPostTags(id, newTags),
    insertPostObjects(
      id,
      Object.values(urlMap).map(({ key }) => key)
    ),
    putPostContent(newFrontmatter.id!, newContent),
  ]);

  return NextResponse.json({
    id,
    created_at: createdAt,
    registered_content: rebuildMarkdown(newFrontmatter, newContent),
  });
}
