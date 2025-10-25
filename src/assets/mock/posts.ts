import type { PostMeta } from "@/types/post";


export const posts: PostMeta[] = [
  {
    id: "0",
    title: "Mock Post 0 Mock Post 0 Mock Post 0 Mock Post 0 Mock Post 0",
    description: "This is a mock post for testing purposes.",
    thumbnailUri: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg",
    category: "experimental",
    createdAt: new Date().toISOString(),
    tags: [
      {
        id: "typescript",
        name: "TypeScript",
        iconUri: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
        category: "experimental"
      },
      {
        id: "linux",
        name: "Linux",
        iconUri: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
        category: "expexrimental"
      },
    ]
  },
  {
    id: "1",
    title: "Mock Post 1 Mock Post 1 Mock Post 1 Mock Post 1 Mock Post 1",
    description: "This is a mock post for testing purposes.",
    thumbnailUri: undefined,
    category: "experimental",
    tags: [
      {
        id: "typescript",
        name: "TypeScript",
        iconUri: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg",
        category: "experimental"
      },
      {
        id: "linux",
        name: "Linux",
        iconUri: undefined,
        category: "experimental"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
