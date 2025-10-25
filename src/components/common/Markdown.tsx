"use client";

import { renderReact } from "@/utils/markdown/render";


export function MarkdownToHtml({ children }: { children: string }) {
  const components = renderReact(children);
  return (<>{components}</>);
}
