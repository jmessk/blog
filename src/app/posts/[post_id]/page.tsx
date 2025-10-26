import { getPost } from "@/infrastructures/post"; import { renderReact } from "@/utils/markdown/render";
import { PostView } from "@/components/post/PostView";


export default async function Post({ params }: { params: Promise<{ post_id: string }> }) {
  const { post_id } = await params;

  let post;

  try {
    post = await getPost({ id: post_id, withContent: true });
  } catch (_e) {
    return (<div>Internal Server Error</div>);
  }

  return (
    <>
      <PostView post={post} />
    </>
  );
}
