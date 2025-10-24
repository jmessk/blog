import { renderReact } from "@/utils/markdown/render";


export async function MarkdownToHtml({ children }: { children: string }) {
  const components = await renderReact(children);
  return (<>{components}</>);
}
