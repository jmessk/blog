import { Island } from "@/components/Island";
import { PostHeader } from "@/components/post/PostHeader";
import { PostMeta } from "@/types/post";


const mockPost1: PostMeta = {
  id: "12345",
  title: "Mock Post",
  description: "This is a mock post for testing purposes.",
  thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg",
  created_at: new Date().toISOString(),
  tags: [
    { id: "typescript", name: "TypeScript", icon_url: undefined },
    { id: "linux", name: "Linux", icon_url: undefined }
  ]
};

const mockPost2: PostMeta = {
  id: "12345",
  title: "Mock Post",
  description: "This is a mock post for testing purposes.",
  thumbnail_url: undefined,
  tags: [
    { id: "typescript", name: "TypeScript", icon_url: undefined },
    { id: "linux", name: "Linux", icon_url: undefined }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function Post() {
  return (
    <>
      <PostHeader postMeta={mockPost1}></PostHeader>
      <PostHeader postMeta={mockPost2}></PostHeader>
      <Island onMobileExpand>Island</Island>
    </>
  );
}