import { SidebarTrigger } from "@/components/ui/sidebar";


export function AppHeader() {
  return (
    <header className="flex z-100 fixed top-0 h-14 shrink-0 items-center gap-2 border-b" >
      <SidebarTrigger />
    </header>
  );
}
