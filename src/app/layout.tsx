import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/AppSidebar";
import { BreadcrumbDemo } from "@/components/common/AppBreadcrumb";
import "@/styles/globals.css";
import { AppHeader } from "@/components/header/AppHeader";


const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hajime's Blog",
  description: "A blog about programming and technology.",
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${notoSansJP.variable}`}>
        <NextThemesProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              <main>
                <BreadcrumbDemo />
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
