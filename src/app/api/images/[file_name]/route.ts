import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function GET({ params }: { params: Promise<{ file_name: string }> }) {
  const { env } = getCloudflareContext();

  const { file_name } = await params;
  const options = { cf: { images: {} } };

  // https://<R2_IMAGES_URL>/<file_name>
  const url = new URL(file_name, env.R2_IMAGES_URL);

  return await fetch(url.toString(), options);
}
