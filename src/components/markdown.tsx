import Script from "next/script";
import styles from "./markdown.module.scss";

export default function Markdown({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.markdown}>
        {children}
      </div>
      {/* <Script
        type="module"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
         import mermaid from "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs";
         mermaid.initialize({startOnLoad: true});
         mermaid.contentLoaded();`,
        }}
      /> */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"></link>
    </>
  )
}
