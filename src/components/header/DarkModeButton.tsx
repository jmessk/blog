import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";


export function DarkModeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}
