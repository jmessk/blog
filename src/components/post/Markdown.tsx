import { renderReact } from "@/utils/markdown/renderer";


export async function Markdown({ children }: { children: string }) {
  const components = await renderReact(children);

  return (<>{components}</>);
}
