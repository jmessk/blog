import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function putImage(key: string, file: File) {
  const { env } = getCloudflareContext();
  const arrayBuffer = await file.arrayBuffer();

  await env.R2_BUCKET.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
  });
}


export async function deleteImage(key: string) {
  const { env } = getCloudflareContext();
  await env.R2_BUCKET.delete(key);
}
