import type { Metadata } from "next";
import { Island } from "@/components/common/Island";


export const metadata: Metadata = {
  title: "Changelog | Hajime's Blog",
  description: "ブログの更新履歴と既知の不具合",
};


export default function Changelog() {
  return (
    <>
      <Island className="doc" title="既知の不具合">
        <ul>
          <li>サイドバーが開いている時にサイドバーのトグルボタンが効かない
            <ul>
              <li>原因： ページ上部のヘッダをサイドバーよりも前面に表示しているため</li>
              <li>z-index を大きく設定しても効果なし</li>
              <li>SheetOverlay が body タグにスタイルを当てている</li>
            </ul>
          </li>
          <li>Mermaid のレンダリングがダークテーマのみになるバグ
            <ul>
              <li>回避策： 一度ページをリロードすると直る</li>
            </ul>
          </li>
        </ul>
      </Island>

      <Island className="doc" title="2025/10/25">
        <ul>
          <li><a href="https://mermaid.js.org/">Mermaid</a> のレンダリングに対応</li>
          <li>目次 (TOC: Table of Contents) 対応</li>
        </ul>
      </Island>

      <Island className="doc" title="2025/10">
        <ul>
          <li>初期リリース</li>
        </ul>
      </Island>
    </>
  );
}
