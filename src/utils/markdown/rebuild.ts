import { stringify } from "yaml";
import { FrontMatter } from "@/types/post";


export function rebuildMarkdown(frontmatter: FrontMatter, content: string): string {
  return `---\n${stringify(frontmatter)}---\n\n${content}`;
}