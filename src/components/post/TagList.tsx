import Image from "next/image";
import Link from "next/link";

import { Tag } from "@/types/post";


const twTagColor = `transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700`;


export function TagList({ tags }: { tags: Tag[] }) {
  return tags.map(tag => (
    <TagListItem tag={tag} key={tag.id} />
  ))
}

export function TagListItem({ tag }: { tag: Tag }) {
  return (
    <Link
      href={`/posts?category=${tag.category}&tags=${tag.id}`}
      key={tag.id}
      className={`shrink-0 flex items-center gap-2 rounded-full p-1 text-foreground ${twTagColor} ${tag.iconUri ? "pr-3" : "px-3"}`}
    >
      {tag.iconUri &&
        <div className="w-5 h-5 overflow-hidden rounded-full bg-white">
          <Image src={tag.iconUri} alt="" width={16} height={16} className="object-cover w-full h-full" />
        </div>
      }
      <span className="text-sm">{tag.name}</span>
    </Link>
  );
}
