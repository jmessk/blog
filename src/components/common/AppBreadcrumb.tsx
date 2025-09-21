"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


export function BreadcrumbDemo({ className }: { className?: string }) {
  const paths = usePathname().split("/").filter(Boolean);

  let pathsWithLabel = paths.map((path, index) => {
    const fullPath = "/" + paths.slice(0, index + 1).join("/");
    const label = path.charAt(0).toUpperCase() + path.slice(1);

    return { path: fullPath, label };
  });

  pathsWithLabel.unshift({ path: "/", label: "Home" });

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {/* <BreadcrumbSeparator /> */}
        {pathsWithLabel.map(({ path, label }) => {

          // If the path is the current pathname, render it as plain text
          if (path === usePathname()) {
            return (
              <BreadcrumbItem key={path}>
                <BreadcrumbPage className="text-lg" >{label}</BreadcrumbPage>
              </BreadcrumbItem>
            )
          }

          return (
            <>
              <BreadcrumbItem key={path}>
                <BreadcrumbLink asChild className="text-base">
                  <Link href={path}>{label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
