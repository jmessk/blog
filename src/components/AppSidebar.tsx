import Link from "next/link";
import { Home, Code, Sprout } from "lucide-react"

import {
  Sidebar,
  // SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home />
                    <span>{"Home"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Blog</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/articles">
                    <Code />
                    <span>{"Development"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/articles">
                    <Sprout />
                    <span>{"Daily Life"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}