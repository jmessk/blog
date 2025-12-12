import type { Metadata } from "next";
import Link from "next/link";

import { PostList, PostListItem } from "@/components/post/PostList";
import { posts } from "@/assets/mock/posts";
import { Island } from "@/components/common/Island";


export const metadata: Metadata = {
  title: "Experimental | Hajime's Blog",
  description: "実験的な機能のテストページ",
  robots: {
    index: false,
    follow: false,
  },
};


export default async function Page() {

  return (
    <>
      <PostList >
        <PostListItem meta={posts[0]} href={`/experimental/${posts[0].id}`} />
        <PostListItem meta={posts[1]} href={`/experimental/${posts[1].id}`} />
      </PostList>
      <Island><button className="transition-colors bg-primary hover:bg-primary-hover p-5 text-primary-foreground rounded-xl">Primary</button></Island>
      <Island><Link href="/posts?category=example">Example</Link></Island>
    </>
  );
}
