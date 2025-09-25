import Image from "next/image";
import Link from "next/link";
import { Clock, PenLine, BrushCleaning } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio"

import { Island } from "@/components/Island";
import { PostMeta } from "@/types/post";


// 2025/01/01 15:30
function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${year}/${month}/${day} ${hour}:${minute}`;
}


const twTimestamp = `text-sm flex items-center gap-2 text-muted-foreground stroke-muted-foreground`;
const twIcon = `w-4 h-4`;

export function PostHeader({ postMeta }: { postMeta: PostMeta }) {
  return (
    <Island noPadding className="gap-6">

      {postMeta.thumbnail_url &&
        <AspectRatio ratio={3 / 1} className="overflow-hidden">
          <Image src={postMeta.thumbnail_url} alt="" width={1800} height={600} className="object-cover w-full h-full" />
        </AspectRatio>
      }

      <div className="grid w-full px-4 sm:px-6 md:px-8 gap-4">

        <h1 className={`mt-0 scroll-m-20 text-center text-2xl font-bold ${postMeta.thumbnail_url ? "sm:mt-2" : "mt-2"}`}>
          {postMeta.title}
        </h1>

        <p className="text-center">
          {postMeta.description}
        </p>

        {postMeta.tags &&
          <div className="flex flex-row justify-center gap-3">
            {postMeta.tags.map(tag => (
              <Link
                href={`/tags/${tag.id}`}
                key={tag.id}
                className="flex items-center gap-1 rounded-full p-1 pr-3 text-foreground transition-colors bg-slate-100 dark:bg-slate-900  hover:bg-slate-200 dark:hover:bg-slate-800 border"
              >
                <div className="w-5 h-5 overflow-hidden rounded-full">
                  {tag.icon_url &&
                    <Image src={tag.icon_url} alt="" width={30} height={30} className="object-cover w-full h-full" />
                  }
                </div>
                <span className="text-sm">{tag.name}</span>
              </Link>
            ))}
          </div>
        }

        <div className="flex gap-5 justify-center">
          <div className={twTimestamp}>
            <Clock className={twIcon} />
            <span className="">{formatDate(postMeta.created_at)}</span>
          </div>
          {postMeta.updated_at &&
            <div className={twTimestamp}>
              <PenLine className={twIcon} />
              <span>{formatDate(postMeta.updated_at)}</span>
            </div>
          }
          {postMeta.deleted_at &&
            <div className={twTimestamp}>
              <BrushCleaning className={twIcon} />
              <span>{postMeta.deleted_at}</span>
            </div>
          }
        </div>

      </div>
    </Island>
  )
}
