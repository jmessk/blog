import { PostList, PostListItem } from "@/components/post/PostList";
import { posts } from "@/assets/mock/posts";


export default async function Page() {

  return (
    <>
      <PostList >
        <PostListItem meta={posts[0]} href={`/experimental/${posts[0].id}`} />
        <PostListItem meta={posts[1]} href={`/experimental/${posts[1].id}`} />
      </PostList>
    </>
  );
}
