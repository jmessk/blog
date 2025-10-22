import { Island } from "@/components/common/Island";


export default function Home() {
  return (
    <>
      <Island className="doc">
        <p>このブログの目的は、プログラミングや開発で得られた知見を記録・発信することです。現在は開発中です。</p>
        <p>以前のブログ: <a href="https://jme-blog.vercel.app/">https://jme-blog.vercel.app/</a></p>
      </Island>

      <Island title="Author" className="doc">
        <dl>
          <dt>作者</dt>
          <dd>佐々木 孟 (Hajime Sasaki)</dd>

          <dt>学年</dt>
          <dd>大学院 修士1年</dd>

          <dt>GitHub</dt>
          <dd><a href="https://github.com/jmessk">jmessk</a></dd>

          <dt>好きな言語</dt>
          <dd><a href="https://rust-lang.org/">Rust</a></dd>
        </dl>
      </Island>

      <Island title="Technical Stack" className="doc">
        <p>Source: <a href="https://github.com/jmessk/blog">jmessk/blog</a> on GitHub.</p>
        <ul>
          <li>Framework: <b>OpenNext-Cloudflare</b> (Next.js)
            <ul>
              <li>Base: <b>React</b> and <b>TypeScript</b></li>
              <li>Styling: <b>Tailwind CSS</b></li>
              <li>ORM: <b>drizzle-orm</b></li>
            </ul>
          </li>
          <li>Hosting: <b>Cloudflare Workers</b></li>
          <li>Database: <b>Cloudflare D1</b></li>
          <li>Object Storage: <b>Cloudflare R2</b></li>
          <li>Image Optimization: <b>Cloudflare Images</b></li>
        </ul>
      </Island>
    </>
  );
}
