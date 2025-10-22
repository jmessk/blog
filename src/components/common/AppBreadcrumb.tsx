"use client"

import React from "react";
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


export function AppBreadcrumb({ title, pathMap, className }: {
  title?: string;
  pathMap?: { [key: string]: string };
  className?: string
}) {
  const paths = usePathname().split("/").filter(Boolean);

  let pathsWithLabel = paths.map((path, index) => {
    const fullPath = "/" + paths.slice(0, index + 1).join("/");
    const label = path.charAt(0).toUpperCase() + path.slice(1);

    if (pathMap && pathMap[fullPath]) {
      return { path: pathMap[fullPath], label };
    }

    return { path: fullPath, label };
  });

  if (pathsWithLabel.length === 0) {
    pathsWithLabel.push({ path: "/", label: "Home" });
  }

  if (pathsWithLabel.length == 1) {
    return (
      <Breadcrumb className={`px-2 ${className}`}>
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem>
            <BreadcrumbPage className="text-2xl font-bold" >
              {title || pathsWithLabel[0].label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className={`px-2 ${className}`}>
      <BreadcrumbList className="flex-nowrap">
        {/* <BreadcrumbSeparator /> */}
        {pathsWithLabel.map(({ path, label }) => {

          // If the path is the current pathname, render it as plain text
          if (path === usePathname()) {
            return (
              <BreadcrumbItem key={path}>
                <BreadcrumbPage className="text-base inline-block max-w-[10rem] truncate" >
                  {title || label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )
          }

          return (
            <React.Fragment key={path}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-base text-primary hover:text-primary-hover">
                  <Link href={path}>{label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
