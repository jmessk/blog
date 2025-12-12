import type { Metadata } from "next";
import { getPostMetaList } from "@/infrastructures/post/meta";
import { PostList, PostListItem } from "@/components/post/PostList";
import { normalizeTags } from "@/utils/tag";
import { Island } from "@/components/common/Island";


export const metadata: Metadata = {
  title: "Posts | Hajime's Blog",
  description: "プログラミングや開発に関する記事一覧",
};


export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; tags?: string }>;
}) {
  const params = await searchParams;
  const { category, tags } = params ?? {};

  const splitedTags = tags?.split(",") ?? [];
  const tagIds = normalizeTags(splitedTags);

  const posts = await getPostMetaList({ category, tagIds });

  if (posts.length === 0) {
    return (
      <Island >
        <p>No posts found.</p>
      </Island>
    )
  }

  return (
    <>
      <PostList >
        {posts.map((post) => (
          <PostListItem key={post.id} meta={post} href={`/posts/${post.id}`} />
        ))}
      </PostList>
    </>
  );
}
