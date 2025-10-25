"use client";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import rehypeMermaid from "rehype-mermaid";

import * as prod from "react/jsx-runtime";
// import Image from "next/image";

import { CodeBlock } from "@/components/post/CodeBlock";

import mermaid from "mermaid";
mermaid.initialize({ startOnLoad: true , theme: "dark"});

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


function codeBlockPre(props: React.HTMLAttributes<HTMLPreElement>) {

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
  // .use(rehypeSlug)
  // .use(rehypeToc, {
  //   headings: ['h2', 'h3'], cssClasses: {
  //     toc: "table-of-contents"
  //   }
  // })
  .use(rehypeMermaid, { strategy: "pre-mermaid" })
  .use(rehypeReact, {
    ...prod,
    components: {
      pre: codeBlockPre,
      // img: nextImage
    }
  });


export function renderReact(markdown: string) {
  const component = processor.processSync(markdown);
  return <>{component.result}</>;
}
