// "use client";

import { PostHeader } from "@/components/post/PostHeader";
import { Island } from "@/components/common/Island";
import { renderReact } from "@/utils/markdown/render";
import { Post } from "@/types/post";


export async function PostView({ post }: { post: Post }) {
  const rendered = await renderReact(post.content);

  return (
    <>
      <PostHeader meta={post} />

      <Island title="目次" className="doc" >
        <article>
          {rendered.toc && <div dangerouslySetInnerHTML={{ __html: rendered.toc }}></div>}
        </article>
      </Island>

      <Island onMobileExpand className="doc py-8">
        {rendered.content}
      </Island>
    </>
  );
}
