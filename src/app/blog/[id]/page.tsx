import { Post } from "@/types/post";
import Article from "@/components/article";
import Metadata from "next";

export async function generateMetadata() {
  // return posts.map((post) => ({
  //   title: post.metadata.title,
  //   description: post.metadata.description,
  // }));
}

export default function Page({ params }: { params: { id: string } }) {
  // const post = posts.find((post) => post.id === params.id) as Post;
  // console.log("blog/[id]/page.tsx", post);

  return (
    <>
      {/* <title>{post.metadata.title}</title>
      <title>{post.metadata.description || post.metadata.title}</title> */}
      {/* <Article {...post} /> */}
      {params.id}
    </>
  );
}
