// "use client";

import { renderReact } from "@/utils/markdown/render";


export async function MarkdownToHtml({ children }: { children: string }) {
  const content = (await renderReact(children)).content;
  return (
    <>
      {content}
    </>
  );
}
