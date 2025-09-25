import Image from "next/image";
import { Tag } from "@/types/post";
import Link from "next/link";


const twTagColor = `transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700`;


export function TagList({ tags }: { tags: Tag[] }) {
  return tags.map(tag => (
    <TagItem tag={tag} key={tag.id} />
  ))
}

export function TagItem({ tag }: { tag: Tag }) {
  return (
    <Link
      href={`/tags/${tag.id}`}
      key={tag.id}
      className={`flex items-center gap-2 rounded-full p-1 text-foreground ${twTagColor} ${tag.icon_url ? "pr-3" : "px-3"}`}
    >
      {tag.icon_url &&
        <div className="w-5 h-5 overflow-hidden rounded-full bg-white">
          <Image src={tag.icon_url} alt="" width={30} height={30} className="object-cover w-full h-full" />
        </div>
      }
      <span className="text-sm">{tag.name}</span>
    </Link>
  );
}
