import { Island } from "@/components/Island";
import { MetaViewer } from "@/components/post/MetaViewer";
import { PostMeta } from "@/types/post";
import Link from "next/link";


const mockPost: PostMeta = {
  id: "12345",
  title: "Mock Post",
  description: "This is a mock post for testing purposes.",
  thumbnail_url: undefined,
  created_at: new Date().toISOString(),
  tags: [
    { id: "typescript", name: "TypeScript", icon_url: undefined },
    { id: "linux", name: "Linux", icon_url: undefined }
  ]
};


export default function Experimental() {
  return (
    <>
      <Island>
        <MetaViewer postMeta={mockPost}></MetaViewer>
      </Island>
    </>
  );
}