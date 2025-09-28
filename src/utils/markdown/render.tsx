// "use client";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
// import rehypeToc from "rehype-toc";
// import rehypeSlug from "rehype-slug";

import * as prod from "react/jsx-runtime";

import { CodeBlock } from "@/components/post/CodeBlock";


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
  const filename = split?.[1];

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
  .use(rehypeReact, { ...prod, components: { pre: codeBlockPre } });


export async function renderReact(markdown: string) {
  const component = await processor.process(markdown);
  return <>{component.result}</>;
}
