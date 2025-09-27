import { NextRequest, NextResponse } from "next/server";
import { getPost } from "@/infrastructures/post";
import { Post, PostMeta } from "@/types/post";

// GET /api/posts/:post_id[?content=true]
export async function GET(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
  const { post_id } = await params;
  const withContent = request.nextUrl.searchParams.get("content") === "true";

  try {

    if (withContent) {
      const result = await getPost({ id: post_id, withContent: true });
      return NextResponse.json(result);
    } else {
      const result = await getPost({ id: post_id, withContent: false });
      return NextResponse.json(result);
    }

  } catch (error) {

    const message = (error as Error).message;
    if (message.includes("is not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json({ error: message }, { status: 500 });

  }
}
