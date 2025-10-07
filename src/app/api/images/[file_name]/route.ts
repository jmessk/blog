import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: Promise<{ file_name: string }> }) {
  const { env } = getCloudflareContext();

  const { file_name } = await params;
  const options = { cf: { images: {} } };

  // https://<R2_IMAGES_BASE_URL>/<file_name>
  const url = new URL(file_name, env.R2_IMAGES_BASE_URL);

  return await fetch(url.toString(), options);
}
