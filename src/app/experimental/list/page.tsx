import { getPosts } from "@/infrastructures/post";
import { PostList } from "@/components/post/PostList";
import { PostMeta } from "@/types/post";


const posts: PostMeta[] = [
  {
    id: "12345",
    title: "Mock Post",
    description: "This is a mock post for testing purposes.",
    thumbnail_uri: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg",
    created_at: new Date().toISOString(),
    tags: [
      { id: "typescript", name: "TypeScript", icon_uri: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
      { id: "linux", name: "Linux", icon_uri: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" }
    ]
  }, {
    id: "12345",
    title: "Mock Post",
    description: "This is a mock post for testing purposes.",
    thumbnail_uri: undefined,
    tags: [
      { id: "typescript", name: "TypeScript", icon_uri: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg" },
      { id: "linux", name: "Linux", icon_uri: undefined }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];


export default async function Page() {

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Posts (Experimental)</h1>
      <PostList metas={posts} basePath="/experimental" />
    </>
  );
}
