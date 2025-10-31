import { getPostMeta, getPostContent } from "@/infrastructures/post"; import { renderReact } from "@/utils/markdown/render";
import { PostView } from "@/components/post/PostView";


export default async function Post({ params }: { params: Promise<{ post_id: string }> }) {
  const { post_id } = await params;

  const meta = await getPostMeta(post_id);
  const content = await getPostContent(post_id);
  if (!meta || !content) {
    return (<div>Internal Server Error</div>);
  }

  const post = { ...meta, content };
  return (
    <>
      <PostView post={post} />
    </>
  );
}
