import Image from "next/image";
import Link from "next/link";
import { Clock, PenLine, BrushCleaning } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio"

import { Island } from "@/components/Island";
import { PostMeta } from "@/types/post";
import { TagList } from "./TagList";


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


export function PostHeader({ meta }: { meta: PostMeta }) {
  return (
    <Island noPadding className="gap-6">

      {meta.thumbnail_url &&
        <AspectRatio ratio={3 / 1} className="overflow-hidden">
          <Image src={meta.thumbnail_url} alt="" width={1800} height={600} className="object-cover w-full h-full" />
        </AspectRatio>
      }

      <div className="grid w-full px-4 sm:px-6 md:px-8 gap-4">

        <h1 className={`scroll-m-20 text-center text-2xl font-bold mt-2`}>
          {meta.title}
        </h1>

        <p className="text-center">
          {meta.description}
        </p>

        {meta.tags && meta.tags.length > 0 &&
          <div className="flex flex-row justify-center gap-3">
            <TagList tags={meta.tags} />
          </div>
        }

        <div className="flex gap-5 justify-center">
          <div className={twTimestamp}>
            <Clock className={twIcon} />
            <span className="">{formatDate(meta.created_at)}</span>
          </div>
          {meta.updated_at &&
            <div className={twTimestamp}>
              <PenLine className={twIcon} />
              <span>{formatDate(meta.updated_at)}</span>
            </div>
          }
          {meta.deleted_at &&
            <div className={twTimestamp}>
              <BrushCleaning className={twIcon} />
              <span>{meta.deleted_at}</span>
            </div>
          }
        </div>

      </div>
    </Island>
  )
}
