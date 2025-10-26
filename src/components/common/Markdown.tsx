"use client";

import { renderReact } from "@/utils/markdown/render";
import Script from "next/script";


export function MarkdownToHtml({ children }: { children: string }) {
  const content = renderReact(children).content;
  return (
    <>
      {content}
      {/* <Script src="https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js" /> */}
    </>
  );
}
