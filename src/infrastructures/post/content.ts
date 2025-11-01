import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function getPostContent(id: string): Promise<string | null> {
  const { env } = getCloudflareContext();
  const content = await env.R2_BUCKET.get(`${id}.md`);
  return content ? await content.text() : null;
}


export async function putPostContent(id: string, content: string): Promise<void> {
  const { env } = getCloudflareContext();

  await env.R2_BUCKET.put(`${id}.md`, content, {
    httpMetadata: {
      contentType: "text/plain",
    },
  });
}


export async function deletePostContent(id: string): Promise<void> {
  const { env } = getCloudflareContext();
  await env.R2_BUCKET.delete(`${id}.md`);
}
