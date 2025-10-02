"use client"

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";


const twIcon = `w-7 h-7 transition-colors stroke-primary hover:stroke-primary-hover`;


export function DarkModeButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      {...props}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`w-10 h-10 flex items-center justify-center ${props.className}`}
    >
      {theme === "dark"
        ? <Moon className={twIcon} />
        : <Sun className={twIcon} />
      }
    </button>
  )
}
