import type { Metadata } from "next";

import { Island } from "@/components/common/Island";
import { TimeLine, TimelineEntry } from "@/components/common/CareerTimeline";


export const metadata: Metadata = {
  title: "Home | Hajime's Blog",
  description: "プログラミングや開発で得られた知見を記録・発信するブログ",
};


const careerTimeline: TimelineEntry[] = [
  {
    date: "2021 年 4 月",
    title: "芝浦工業大学 工学部 情報工学科 入学",
  },
  {
    date: "2025 年 3 月",
    title: "芝浦工業大学 工学部 情報工学科 卒業",
  },
  {
    date: "2025 年 4 月",
    title: "芝浦工業大学大学院 理工学研究科 電気電子情報工学専攻（修士課程）入学",
  },
  {
    date: "2025 年 10 月",
    title: "Markdown Blog v2.0（本ブログ）リリース",
  },
];


export default function Home() {
  return (
    <>
      <Island className="doc">
        <p>このブログは、プログラミングや開発で得られた知見を記録・発信することを目的としています。</p>
        <p>以前のブログ: <a href="https://jme-blog.vercel.app/">https://jme-blog.vercel.app/</a></p>
        <p>このブログの開発に関する投稿をしました。<a href="https://blog.jmessk.net/posts/019b0d03-e0d9-721d-9e8c-e647c9180ae4">Markdown Blog (v2.0) を作った</a></p>
      </Island>

      <Island title="Profile" className="doc">
        <dl>
          <dt>作者</dt>
          <dd>佐々木 孟 (Hajime Sasaki)</dd>

          <dt>学年</dt>
          <dd>大学院 修士1年</dd>

          <dt>好きな言語</dt>
          <dd><a href="https://rust-lang.org/">Rust</a></dd>

          <dt>GitHub</dt>
          <dd><a href="https://github.com/jmessk">jmessk</a></dd>

          <dt>Email</dt>
          <dd><a href="mailto:contact@jmessk.net">contact@jmessk.net</a></dd>
        </dl>
      </Island>

      <Island title="Career Timeline">
        <TimeLine items={careerTimeline} />
      </Island>
    </>
  );
}
