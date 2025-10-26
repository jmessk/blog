"use client";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeToc from "rehype-toc";
// import rehypeMermaid from "rehype-mermaid";
import rehypeReact from "rehype-react";

import React from "react";
import { useEffect } from "react";
import type { VFile } from "vfile";
import * as prod from "react/jsx-runtime";
// import Image from "next/image";
// import mermaid from "mermaid";
import type { Root, Image } from "mdast";
import { visit } from "unist-util-visit";
import { toHtml } from 'hast-util-to-html';
import mermaid from "mermaid";

import { CodeBlock } from "@/components/post/CodeBlock";


declare module "vfile" {
  interface DataMap {
    toc: string;
  }
}


// mermaid.initialize({ startOnLoad: true , theme: "dark"});

// function nextImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
//   return (
//     <div className="img-container">
//       <Image
//         src={props.src || ""}
//         alt={props.alt || ""}
//         width={props.width as number}
//         height={600}
//       />
//     </div>
//   )
// }


function extractToc() {
  return (tree: Root, file: VFile) => {

    visit(tree, "element", (node: any, index: number | null, parent: any) => {
      if (node.tagName === "nav" && node.properties.className.includes("toc")) {
        const tocHtml = toHtml(node);
        file.data.toc = tocHtml;

        // Remove the toc node from the tree
        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1);
        }
      }
    });

  };
}


function codeToCodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {

  const childrenArray = Array.isArray(props.children)
    ? props.children
    : [props.children];

  const first = childrenArray[0] as any;
  if (!(first && typeof first === "object" && first.type === "code")) {
    return <pre {...props}>{props.children}</pre>;
  }

  const className: string | undefined = first.props?.className;

  // class="language-<lang>:<filename>"
  const split = className?.split("-")[1]?.split(":");
  const lang = split?.[0] ?? "plaintext";
  const filename = split?.slice(1).join();

  if (lang === "mermaid") {
    return (
      <pre className="mermaid">{first.props?.children ?? ""}</pre>
    )
  }

  return (
    <CodeBlock lang={lang} filename={filename}>
      {first.props?.children ?? ""}
    </CodeBlock>
  );
}


const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeToc, { headings: ['h2', 'h3'] })
  .use(extractToc)
  // .use(rehypeMermaid, { strategy: "pre-mermaid" })
  .use(rehypeReact, {
    ...prod,
    components: {
      pre: codeToCodeBlock,
      // img: nextImage
    }
  });


export function renderReact(markdown: string) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: "dark" });
    mermaid.contentLoaded();
  }, []);

  const file = processor.processSync(markdown) as VFile;

  return {
    content: <>{file.result}</>,
    toc: file.data.toc as string | undefined,
  }
}
