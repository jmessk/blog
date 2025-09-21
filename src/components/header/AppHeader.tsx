import { ToggleSidebarButton } from "./ToggleSidebarButton";
import { DarkModeButton } from "./DarkModeButton";
import { metadata } from "@/app/layout";


export function AppHeader() {
  return (
    <header className={`fixed h-12 w-full top-0 z-999 bg-card/30 backdrop-blur-sm flex items-center gap-2 px-1`}>
      <ToggleSidebarButton className="" />
      <span className="ml-7 text-lg font-semibold text-gray-700 dark:text-gray-400">{String(metadata.title)}</span>
      <DarkModeButton className="ml-auto" />
    </header>
  );
}
