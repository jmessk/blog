import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {

  const BASE_PATH = process.env.BRANCH_NAME ? "/" + process.env.BRANCH_NAME : "";

  return {
    theme_color: "#005fb1",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    name: "jme Blog",
    short_name: "jme Blog",
    description: "Tech blog",
    icons: [
      {
        src: BASE_PATH + "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: BASE_PATH + "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png"
      },
      {
        src: BASE_PATH + "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png"
      },
      {
        src: BASE_PATH + "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
}