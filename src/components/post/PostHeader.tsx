import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio"

import { Island } from "@/components/common/Island";
import { PostMeta } from "@/types/post";
import { TagList } from "./TagList";
import { DateList, formatDate } from "./DateList";


export function PostHeader({ meta }: { meta: PostMeta }) {
  const createdAt = formatDate(meta.created_at);
  const updatedAt = meta.updated_at ? formatDate(meta.updated_at) : undefined;

  return (
    <Island noPadding className="">

      {meta.thumbnail_uri &&
        <AspectRatio ratio={3 / 1} className="overflow-hidden">
          <Image src={meta.thumbnail_uri} alt="" width={1800} height={600} className="object-cover w-full h-full" />
        </AspectRatio>
      }

      <div className={`grid w-full px-4 sm:px-6 md:px-8 gap-4 py-6`}>

        <h1 className={`scroll-m-20 text-center text-2xl font-bold my-4`}>
          {meta.title}
        </h1>

        <p className="text-center">
          {meta.description}
        </p>

        {meta.tags && meta.tags.length > 0 &&
          <div className="flex flex-row justify-center gap-x-3 gap-y-2 flex-wrap">
            <TagList tags={meta.tags} />
          </div>
        }

        <div className="flex gap-5 justify-center">
          <DateList createdAt={createdAt} updatedAt={updatedAt} />
        </div>

      </div>
    </Island>
  )
}
