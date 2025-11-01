"use client";

import { renderReact } from "@/utils/markdown/render";


export function MarkdownToHtml({ children }: { children: string }) {
  const content = renderReact(children).content;
  return (
    <>
      {content}
    </>
  );
}
