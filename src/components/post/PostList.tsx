import Image from "next/image";
import Link from "next/link";

import { PostMeta } from "@/types/post";
import { DateList, formatDateShort } from "./DateList";
import { TagList } from "./TagList";
import { Island } from "@/components/common/Island";


export function PostList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <ul className={`flex flex-col gap-6 ${className || ""}`}>
      {children}
    </ul>
  );
}


export function PostListItem({ meta, href }: { meta: PostMeta; href: string }) {
  const createdAt = formatDateShort(meta.created_at);
  const updatedAt = meta.updated_at ? formatDateShort(meta.updated_at) : undefined;

  const thumbnail = meta.thumbnail_uri ? (
    <div className="relative w-full overflow-hidden h-30 sm:h-[142px] sm:w-50 sm:flex-shrink-0">
      <Image
        src={meta.thumbnail_uri}
        alt=""
        width={300}
        height={200}
        className="object-cover w-full h-full"
        priority={false}
      />
    </div>
  ) : null;

  return (
    <li className="list-none">
      <Link href={href}>
        <Island noPadding className="group flex flex-col sm:flex-row overflow-hidden hover:bg-card-hover transition-colors">

          {thumbnail}

          <div className={`flex flex-col w-full px-4 sm:px-6 py-4 gap-1`}>

            <div className={`flex items-center mb-1 h-[50px]`}>
              <h2 className="text-lg text-foreground font-semibold leading-snug line-clamp-2">{meta.title}</h2>
            </div>

            {/* {meta.description && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-1">
                {meta.description}
              </p>
            )} */}

            {meta.tags && meta.tags.length > 0 && (
              <div className="relative overflow-hidden pr-4">
                <div className="flex flex-nowrap gap-2 whitespace-nowrap">
                  <TagList tags={meta.tags} />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent group-hover:hidden" />
              </div>
            )}
            <div className="flex gap-5 text-muted-foreground">
              <DateList createdAt={createdAt} updatedAt={updatedAt} />
            </div>

          </div>
        </Island>
      </Link>
    </li >
  );
}
