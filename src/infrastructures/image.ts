import { getCloudflareContext } from "@opennextjs/cloudflare";
import { uuidv7 } from "uuidv7";

export async function uploadImage(file: File): Promise<string> {
  const { env } = getCloudflareContext();

  const id = uuidv7();
  const fileExtension = file.name.split('.').pop() || '';
  const objectKey = `${id}.${fileExtension}`;

  const arrayBuffer = await file.arrayBuffer();

  await env.R2_IMAGES.put(objectKey, arrayBuffer, {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
  });

  const path = `/api/images/${objectKey}`;

  return path;
}
