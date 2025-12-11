import { Island } from "@/components/common/Island";
// import { Mail, Github } from "lucide-react";


export default function Home() {
  return (
    <>
      <Island className="doc">
        <p>このブログは、プログラミングや開発で得られた知見を記録・発信することを目的としています。</p>
        <p>以前のブログ: <a href="https://jme-blog.vercel.app/">https://jme-blog.vercel.app/</a></p>
        <p>このブログの開発に関する投稿をしました。[Markdown Blog (v2.0) を作った](https://blog.jmessk.net/posts/019b0d03-e0d9-721d-9e8c-e647c9180ae4)</p>
      </Island>

      <Island title="Author" className="doc">
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
    </>
  );
}
