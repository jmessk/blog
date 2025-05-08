import styles from "./home.module.scss";
import Island from "@/components/island";
import PageHeader from "@/components/page-header";
import LinkCard from "@/components/link-card";
import Markdown from "@/components/markdown";


export default function Home() {
  return (
    <>
      <PageHeader title="Home" />

      <Island expansion>
        <Markdown>
          {/* <h2>このサイトについて</h2> */}
          <p>
            このサイトは個人的に作成したブログサイトで、
            技術記事や日記などを投稿していく予定です。
          </p>
          <p>
            サイト作成に当たって web技術を学ぶ事を目的としています。
          </p>
        </Markdown>
      </Island>

      <Island header2="作者" expansion>
        <Markdown>
          {/* <h2>作者</h2> */}
          <ul>
            <li>芝浦工業大学 情報工学科 4年 佐々木孟</li>
            <li>千葉県</li>
            <li>静的型付け</li>
          </ul>
        </Markdown>
      </Island>

      <Island header2="リンク" expansion>
        <Markdown>
          <h4>GitHub</h4>
          <LinkCard href="https://github.com/jme-rs" />

          <h4>サイトのソースコード</h4>
          <LinkCard href="https://github.com/jme-rs/next-app" />
        </Markdown>
      </Island>
    </>
  )
}
