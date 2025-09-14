import { unified } from "unified";
import remarkParse from "remark-parse";
// import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import yaml from "yaml";

import { visit } from "unist-util-visit";
import type { Root, Image } from "mdast";
import type { VFile } from "vfile";

import { PostMeta } from "@/types/post";


declare module "vfile" {
  interface DataMap {
    frontmatter: Partial<PostMeta>;
    images: string[];
  }
}

function collectImagesPaths() {
  return (tree: Root, file: VFile) => {
    const images = (file.data.images ??= []);
    visit(tree, "image", (node: Image) => images.push(node.url));
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkExtractFrontmatter, { yaml: yaml.parse, name: "frontmatter" })
  .use(collectImagesPaths);

export function parse(markdown: string) {
  const file = processor.processSync(markdown);

  return {
    frontmatter: file.data.frontmatter || {},
    imagePaths: file.data.images || []
  };
}
