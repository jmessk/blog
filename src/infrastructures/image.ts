import { getCloudflareContext } from "@opennextjs/cloudflare";
import { uuidv7 } from "uuidv7";

export async function uploadImage(file: File): Promise<string> {
  const { env } = getCloudflareContext();

  const id = uuidv7();
  const fileExtension = file.name.split('.').pop() || '';
  const objectKey = `${id}.${fileExtension}`;

  await env.R2_IMAGES.put(objectKey, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  const path = `/api/images/${objectKey}`;

  return path;
}
