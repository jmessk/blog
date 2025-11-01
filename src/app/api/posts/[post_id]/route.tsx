import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { Post } from "@/types/post";
import { extractContents } from "@/utils/markdown/extract";
import { replacePaths } from "@/utils/markdown/replace";
import { rebuildMarkdown } from "@/utils/markdown/rebuild";
import { normalizeTags } from "@/utils/tag";
import { normalizeCategory } from "@/utils/category";
import { getPostMeta, updatePostMeta } from "@/infrastructures/post/meta";
import { putPostContent, getPostContent } from "@/infrastructures/post/content";
import { insertTags } from "@/infrastructures/tag";
import { insertPostTags, deletePostTags } from "@/infrastructures/postTag";
import { deletePostObjects, getPostObjectKeys, insertPostObjects } from "@/infrastructures/postObject";
import {
  checkAllFilesExist,
  isUrl,
  makeFileMap,
  makeUriMap,
  updateFrontmatter,
  validateFormData
} from "@/utils/helper";


// GET /api/posts/:post_id[?content=true]
export async function GET(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
  const { post_id } = await params;
  const withContent = request.nextUrl.searchParams.get("content") === "true";

  if (withContent) {
    const meta = await getPostMeta(post_id);
    const content = await getPostContent(post_id);
    if (!meta || !content) {
      return NextResponse.json({ error: `"post_id ${post_id} is not found"` }, { status: 404 });
    }

    return NextResponse.json({ ...meta, content } as Post);
  }

  const meta = await getPostMeta(post_id);
  if (!meta) {
    return NextResponse.json({ error: `"post_id ${post_id} is not found"` }, { status: 404 });
  }

  return NextResponse.json(meta);
}


export async function PUT(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
  const { post_id } = await params;
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



  const updatedAt = new Date().toISOString();
  const newCategory = normalizeCategory(frontmatter.category!);
  const newTags = normalizeTags(frontmatter.tags || []);
  const newFrontmatter = updateFrontmatter(
    frontmatter,
    { category: newCategory, tags: newTags, updated_at: updatedAt },
    urlMap
  );
  const newContent = replacePaths(content, urlMap);


  const existingPostObjectKeys = await getPostObjectKeys(post_id);

  await Promise.all([
    env.R2_BUCKET.delete([...existingPostObjectKeys, `${post_id}.md`]),
    deletePostObjects(post_id),
    deletePostTags(post_id),
  ]);


  await Promise.all([
    putPostContent(post_id, newContent),
    updatePostMeta({
      id: post_id,
      title: newFrontmatter.title!,
      description: newFrontmatter.description!,
      category: newCategory,
      thumbnail_uri: newFrontmatter.thumbnail_uri ,
      updated_at: updatedAt,
    }),
    insertTags(newTags.map((tagId) => ({
      id: tagId,
      category: newCategory,
      label: tagId
    }))),
    insertPostTags(post_id, newTags),
    insertPostObjects(
      post_id,
      Object.values(urlMap).map(({ key }) => key)
    )
  ]);

  return NextResponse.json({
    id: post_id,
    updated_at: updatedAt,
    registered_content: rebuildMarkdown(newFrontmatter, newContent),
  });
}
