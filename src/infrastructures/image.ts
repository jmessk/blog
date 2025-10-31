import { getCloudflareContext } from "@opennextjs/cloudflare";
import { uuidv7 } from "uuidv7";

export async function putImage(file: File): Promise<string> {
  const { env } = getCloudflareContext();

  const id = uuidv7();
  const fileExtension = file.name.split('.').pop() || '';
  const filename = `${id}.${fileExtension}`;

  const arrayBuffer = await file.arrayBuffer();

  await env.R2_BUCKET.put(filename, arrayBuffer, {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
  });

  return filename;
}
