import { getPosts } from "@/infrastructures/post";
import { PostList, PostListItem } from "@/components/post/PostList";
import { normalizeTags } from "@/utils/tag";


export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; tags?: string }>;
}) {
  const params = await searchParams;
  const { category, tags } = params ?? {};

  const splitedTags = tags?.split(",") ?? [];
  const tagIds = normalizeTags(splitedTags);

  const posts = await getPosts({ category, tagIds });

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
