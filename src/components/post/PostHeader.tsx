import { Clock, PenLine, BrushCleaning } from "lucide-react";

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
        <img src={postMeta.thumbnail_url} alt="" className="bg-blue-300" />
      }

      <div className="grid w-full px-4 sm:px-6 md:px-8 gap-4">

        <h1 className="mt-0 sm:mt-2 scroll-m-20 text-center text-2xl font-bold">
          {postMeta.title}
        </h1>

        <p className="text-center">
          {postMeta.description}
        </p>

        <div className="flex gap-4 justify-center">
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
