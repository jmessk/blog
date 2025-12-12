import type { Metadata } from "next";
import { cache } from "react";
import { getPostMeta } from "@/infrastructures/post/meta";
import { getPostContent } from "@/infrastructures/post/content";
import { PostView } from "@/components/post/PostView";


type Props = {
  params: Promise<{ post_id: string }>;
};


// Reactのcache関数でメモ化し、同一リクエスト内での重複DBアクセスを防止
const getCachedPostMeta = cache(getPostMeta);


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post_id } = await params;
  const meta = await getCachedPostMeta(post_id);

  if (!meta) {
    return {
      title: "記事が見つかりません | Hajime's Blog",
    };
  }

  return {
    title: `${meta.title} | Hajime's Blog`,
    description: meta.description ?? `${meta.title}に関する記事`,
    openGraph: {
      title: meta.title,
      description: meta.description ?? `${meta.title}に関する記事`,
      type: "article",
      publishedTime: meta.created_at,
      modifiedTime: meta.updated_at ?? undefined,
      images: meta.thumbnail_uri ? [meta.thumbnail_uri] : undefined,
    },
  };
}


export default async function Post({ params }: Props) {
  const { post_id } = await params;

  const meta = await getCachedPostMeta(post_id);
  const content = await getPostContent(post_id);
  if (!meta || !content) {
    return (<div>Internal Server Error</div>);
  }

  console.log("Post meta:", meta);

  const post = { ...meta, content };
  return (
    <>
      <PostView post={post} />
    </>
  );
}
