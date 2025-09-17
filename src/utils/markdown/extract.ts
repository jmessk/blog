import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtractFrontmatter from "remark-extract-frontmatter";

import yaml from "yaml";
import { visit } from "unist-util-visit";
import { remove } from "unist-util-remove";
import { Node } from "unist";
import type { Root, Image } from "mdast";
import type { VFile } from "vfile";

import { FrontMatter } from "@/types/post";


declare module "vfile" {
  interface DataMap {
    frontmatter?: FrontMatter;
    images?: string[];
  }
}

function collectImagesPaths() {
  return (tree: Root, file: VFile) => {
    const images = (file.data.images ??= []);
    visit(tree, "image", (node: Image) => images.push(node.url));
  };
}

function removeFrontmatter() {
  return (tree: Node) => remove(tree, (node) => node.type === "yaml");
}

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkExtractFrontmatter, { yaml: yaml.parse, name: "frontmatter" })
  .use(removeFrontmatter)
  .use(collectImagesPaths)
  .use(remarkStringify);

export function extractContents(markdown: string) {
  const file = processor.processSync(markdown);
  const frontmatter = file.data.frontmatter ?? {}
  const imagePaths = file.data.images ?? [];

  if (file.data.frontmatter?.thumbnail_url) {
    imagePaths.push(file.data.frontmatter.thumbnail_url);
  }

  return {
    content: String(file),
    frontmatter: frontmatter,
    imagePaths: imagePaths,
  };
}
