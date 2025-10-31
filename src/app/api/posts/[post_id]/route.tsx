import { NextRequest, NextResponse } from "next/server";
import { getPostContent, getPostMeta } from "@/infrastructures/post";
import { Post, PostMeta } from "@/types/post";

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


// export async function UPDATE(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {

// }