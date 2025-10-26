import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";

import { visit } from "unist-util-visit";
import type { Root, Image } from "mdast";
import { VFile } from "vfile";
// import path from "path";


declare module "vfile" {
  interface DataMap {
    urlMap: Record<string, string>;
  }
}

function replaceImagePath() {
  return (tree: Root, file: VFile) => {
    const urlMap = file.data.urlMap || {};

    visit(tree, "image", (node: Image) => {
      if (urlMap[node.url]) {
        node.url = urlMap[node.url];
      }
    });

  };
}

const processor = unified()
  .use(remarkParse)
  .use(replaceImagePath)
  .use(remarkStringify);

export function replacePaths(
  content: string,
  urlMap: Record<string, string>,
): string {
  const file = new VFile({ value: content });
  file.data.urlMap = urlMap;

  const newFile = processor.processSync(file);
  return String(newFile);
}
