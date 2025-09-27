import type { Metadata } from "next";
import { Noto_Sans_JP, } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "@/styles/globals.css";
import { AppSidebar } from "@/components/common/AppSidebar";
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";
import { AppHeader } from "@/components/header/AppHeader";
import { MainContainer } from "@/components/common/MainContainer";


const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
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
      <body>
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
              <MainContainer>
                <AppBreadcrumb className="my-6" />
                {children}
              </MainContainer>
            </SidebarInset>
          </SidebarProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
