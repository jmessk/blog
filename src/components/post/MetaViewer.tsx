import { Island } from "@/components/Island";
import { PostMeta } from "@/types/post";


export function MetaViewer({ postMeta }: { postMeta: PostMeta }) {
  return (
    <Island>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        {postMeta.title}
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {postMeta.description}
      </p>
      
    </Island>
  )
}