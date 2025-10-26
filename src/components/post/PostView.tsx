"use client";

import { PostHeader } from "@/components/post/PostHeader";
import { Island } from "@/components/common/Island";
import { renderReact } from "@/utils/markdown/render";
import { Post } from "@/types/post";


export function PostView({ post }: { post: Post }) {
  const file = renderReact(post.content);

  return (
    <>
      <PostHeader meta={post} />

      <Island title="目次" className="doc" >
        {file.toc && <div dangerouslySetInnerHTML={{ __html: file.toc }}></div>}
      </Island>

      <Island onMobileExpand className="doc py-8">
        {file.content}
      </Island>
    </>
  );
}
