import { Island } from "@/components/common/Island";


export default function Home() {
  return (
    <>
      <Island className="doc">
        <h2>About This Blog</h2>
        <p>このブログは、プログラミングや開発で得られた知見を記録・発信することを目的としています。その他日常生活に関する投稿を行っていきます。</p>
        <p>現在は開発中です。</p>
        <p>以前のブログ: <a href="https://jme-blog.vercel.app/">https://jme-blog.vercel.app/</a></p>

        <h2>Profile</h2>
        <dl>
          <dt>作者</dt>
          <dd>佐々木 孟 (Hajime Sasaki)</dd>

          <dt>GitHub</dt>
          <dd>
            <a href="https://github.com/jmessk">
              jmessk
            </a>
          </dd>
          <dt>学年</dt>
          <dd>修士1年</dd>
        </dl>
      </Island>

      <Island className="doc">
        <h2>Technical Stack</h2>
        <p>Source: <a href="https://github.com/jmessk/blog">jmessk/blog</a> on GitHub.</p>
        <ul>
          <li>Base: <b>Next.js</b> and <b>OpenNext-Cloudflare</b> (with <b>React</b>, <b>TypeScript</b>, <b>Tailwind CSS</b>)</li>
          <li>Hosting on: <b>Cloudflare Workers</b>
            <ul>
              <li>Domain (<code>blog.jmessk.net</code>)</li>
              <li><b>D1</b> and <b>R2</b> as Storage</li>
              <li><b>Cloudflare Images</b> as Image Optimization and Content Delivery</li>
            </ul>
          </li>
        </ul>
      </Island>
    </>
  );
}
