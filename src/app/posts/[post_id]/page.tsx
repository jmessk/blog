// import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";

// import { notFound } from "next/navigation";
import { PostHeader } from "@/components/post/PostHeader";
import { Island } from "@/components/common/Island";
import { Markdown } from "@/components/common/Markdown";
import { getPost } from "@/infrastructures/post";


export default async function Post({ params }: { params: Promise<{ post_id: string }> }) {
  const { post_id } = await params;

  let post;

  try {
    post = await getPost({ id: post_id, withContent: true });
  } catch (error) {
    return (<div>{(error as Error).message}</div>);
  }

  return (
    <>
      {/* <AppBreadcrumb title={post.title} pathMap={{ "/posts": `/posts?category=${post.category}` }} /> */}

      <PostHeader meta={post} />
      <Island onMobileExpand>
        <div className="doc">
          <Markdown>{post.content}</Markdown>
        </div>
      </Island>
    </>
  );
}
