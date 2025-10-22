import type { Metadata } from "next";
import { Noto_Sans_JP, } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "@/styles/globals.css";
import { AppSidebar } from "@/components/common/AppSidebar";
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";
import { AppHeader } from "@/components/header/AppHeader";
import { AppFooter } from "@/components/common/AppFooter";


const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Hajime's Blog",
  description: "A blog about programming, development and daily life.",
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={notoSansJP.variable}>
      <body className="min-h-screen flex flex-col">
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppHeader />
            <AppSidebar />
            <SidebarInset>
              <div className="mt-12 pt-6 max-w-4xl w-full flex-1 flex flex-col mx-auto px-4 sm:px-8 md:px-12">
                <AppBreadcrumb className="mb-6" />
                <div className="flex-1 flex flex-col gap-10">
                  {children}
                </div>
                <AppFooter className="mt-10 mb-4" />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
