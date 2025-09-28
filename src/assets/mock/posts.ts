import type { PostMeta } from "@/types/post";

export const posts: PostMeta[] = [
  {
    id: "0",
    title: "Mock Post 0",
    description: "This is a mock post for testing purposes.",
    thumbnail_uri: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg",
    category: "tech",
    created_at: new Date().toISOString(),
    tags: [
      {
        id: "typescript",
        name: "TypeScript",
        icon_uri: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
      },
      {
        id: "linux",
        name: "Linux",
        icon_uri: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg"
      }
    ]
  },
  {
    id: "1",
    title: "Mock Post 1",
    description: "This is a mock post for testing purposes.",
    thumbnail_uri: undefined,
    category: "tech",
    tags: [
      {
        id: "typescript",
        name: "TypeScript",
        icon_uri: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg"
      },
      {
        id: "linux",
        name: "Linux",
        icon_uri: undefined
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
