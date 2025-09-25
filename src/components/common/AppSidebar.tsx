"use client"

import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Home, Code, Sprout, LucideProps, History, FlaskConical } from "lucide-react"

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
  useSidebar,
} from "@/components/ui/sidebar"


function ButtonItem({
  text,
  href,
  icon: Icon,
}: {
  text: string
  href: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}) {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="h-10 transition-colors" onClick={() => toggleSidebar()}>
        <Link href={href} className="gap-4 pl-4">
          {/*
            `size` prop is not working.
            more information: https://github.com/shadcn-ui/ui/issues/6316
           */}
          <Icon className="!size-6 stroke-gray-500 dark:stroke-gray-400" />
          <span className="text-base font-medium text-gray-700 dark:text-gray-300">{text}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}


const twGroupeLabel = "text-sm text-muted-foreground";


export function AppSidebar() {
  return (
    <Sidebar className="top-12">
      <SidebarContent className="pt-13 flex flex-col">

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              <ButtonItem text="Home" href="/" icon={Home} />

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={twGroupeLabel}>Blog</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

              <ButtonItem text={"Tech"} href={"/posts"} icon={Code} />
              <ButtonItem text={"Life"} href={"/posts"} icon={Sprout} />

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={twGroupeLabel}>Development</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

              <ButtonItem text={"Changelog"} href={"/changelog"} icon={History} />
              <ButtonItem text={"Experimental"} href={"/experimental"} icon={FlaskConical} />

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
