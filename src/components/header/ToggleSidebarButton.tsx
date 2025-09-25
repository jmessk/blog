"use client"

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";


export function ToggleSidebarButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={() => toggleSidebar()}
      {...props}
      className={`w-10 h-10 flex items-center justify-center transition-colors rounded-md hover:bg-slate-200 dark:hover:bg-zinc-900 ${props.className}`}
    >
      <Menu className="w-9 h-9 stroke-slate-600 dark:stroke-gray-400" />
    </button>
  )
}
