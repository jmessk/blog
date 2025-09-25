import { ToggleSidebarButton } from "./ToggleSidebarButton";
import { DarkModeButton } from "./DarkModeButton";
import { metadata } from "@/app/layout";
import Link from "next/link";


export function AppHeader() {
  return (
    <header className={`fixed h-12 w-full top-0 z-999 bg-card/30 backdrop-blur-sm flex items-center gap-2 px-1`}>
      <ToggleSidebarButton className="" />
      <Link
        href={"/"}
        className="ml-7 text-lg font-semibold text-gray-700 dark:text-gray-300">
        {String(metadata.title)}
      </Link>
      <DarkModeButton className="ml-auto" />
    </header>
  );
}
