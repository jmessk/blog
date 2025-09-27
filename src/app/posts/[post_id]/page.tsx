import { notFound } from "next/navigation";
import { PostHeader } from "@/components/post/PostHeader";
import { Island } from "@/components/Island";
import { Markdown } from "@/components/post/Markdown";
import { getPost } from "@/infrastructures/post";

// NOTE: 必要であれば ISR / キャッシュ戦略を調整
// export const revalidate = 60; // 例: 60秒再検証

export default async function Post({ params }: { params: Promise<{ post_id: string }> }) {
  const { post_id } = await params;

  let post;
  try {
    post = await getPost({ id: post_id, withContent: true });
  } catch (error) {
    // 予期しないエラー時は簡易表示（本番では専用エラーページやログ連携検討）
    return (
      <div className="p-6 text-sm text-red-600 dark:text-red-400">
        {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <PostHeader meta={post} />
      <Island onMobileExpand>
        <div className="doc">
          {/* Markdown コンポーネントはサーバー側で同期レンダリング */}
          <Markdown>
            {post.content}
          </Markdown>
        </div>
      </Island>
    </>
  );
}
