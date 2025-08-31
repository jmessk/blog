import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: NextRequest) {
  const { env, cf, ctx } = getCloudflareContext();
  const tags = request
    .nextUrl
    .searchParams
    .get("tags")?.split(",") || [];

  const posts = await env.POSTS_DB;

  return new Response(JSON.stringify(posts), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  const { env, cf, ctx } = getCloudflareContext();
  const tags = request
    .nextUrl
    .searchParams
    .get("tags")?.split(",") || [];

  const posts = await env.POSTS_DB;

  return new Response(JSON.stringify(posts), {
    headers: { "Content-Type": "application/json" },
  });
}