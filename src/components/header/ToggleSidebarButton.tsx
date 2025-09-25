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
      className={`w-10 h-10 flex items-center justify-center ${props.className}`}
    >
      <Menu className="w-9 h-9 transition-colors stroke-gray-600 hover:stroke-gray-900 dark:stroke-gray-400 dark:hover:stroke-gray-300" />
    </button>
  )
}
