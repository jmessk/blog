import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import path from "path";


export async function GET(request: NextRequest, { params }: { params: Promise<{ file_name: string }> }) {
  const { env } = getCloudflareContext();

  const R2_IMAGES_URL = env.R2_IMAGES_URL;

  const { file_name } = await params;
  const image_id = path.parse(file_name).name;
  const options = { cf: { images: {} } };


  return await fetch(`${R2_IMAGES_URL}/${image_id}`, options);
}
