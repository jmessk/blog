import "./globals.scss";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import BackLink from "@/components/back-link";

// const inter = Inter({ subsets: ['latin'] })
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
  variable: '--font-noto-sans-jp',
  display: 'swap',
  fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'jme Blog',
  description: 'Tech Blog by jme',
  icons: [
    {
      url: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      url: "/icons/icon-256x256.png",
      sizes: "256x256",
      type: "image/png"
    },
    {
      url: "/icons/icon-384x384.png",
      sizes: "384x384",
      type: "image/png"
    },
    {
      url: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ],
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <head>
        <link rel="apple-touch-icon" sizes="256x256" href={"/icons/icon-256x256.png"} />
        <link rel="manifest" href={"/manifest.json"}></link>
      </head>

      <body className={notoSansJp.className} data-theme="light">
        <Header />
        <div className='wrapper'>
          <main>
            <BackLink />
            {children}
          </main>
        </div>
        <Footer />
      </body>

    </html>
  )
}
