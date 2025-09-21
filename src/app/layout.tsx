import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "@/styles/globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { BreadcrumbDemo } from "@/components/common/AppBreadcrumb";
import { AppHeader } from "@/components/header/AppHeader";
import { MainContainer } from "@/components/common/MainContainer";


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
    <html lang="en" suppressHydrationWarning>
      <body className={notoSansJP.variable}>
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
                <BreadcrumbDemo className="my-6" />
                {children}
              </MainContainer>
            </SidebarInset>
          </SidebarProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
