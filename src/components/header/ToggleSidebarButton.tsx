"use client"

import { Menu, X } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";


export function ToggleSidebarButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar, openMobile } = useSidebar();

  return (
    <button
      onClick={() => toggleSidebar()}
      {...props}
      className={`w-10 h-10 flex items-center justify-center ${props.className}`}
    >
      {openMobile
        ? <X className={`w-9 h-9 transition-colors stroke-primary-hover`} />
        : <Menu className={`w-9 h-9 transition-colors stroke-primary hover:stroke-primary-hover`} />
      }
    </button>
  )
}
