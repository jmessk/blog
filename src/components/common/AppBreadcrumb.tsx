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


export function AppBreadcrumb({ className }: { className?: string }) {
  const paths = usePathname().split("/").filter(Boolean);

  let pathsWithLabel = paths.map((path, index) => {
    const fullPath = "/" + paths.slice(0, index + 1).join("/");
    const label = path.charAt(0).toUpperCase() + path.slice(1);

    return { path: fullPath, label };
  });

  if (pathsWithLabel.length === 0) {
    pathsWithLabel.push({ path: "/", label: "Home" });
  }

  if (pathsWithLabel.length == 1) {
    return (
      <Breadcrumb className={`px-2 $${className}`}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xl font-bold" >{pathsWithLabel[0].label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className={`px-2 $${className}`}>
      <BreadcrumbList>
        {/* <BreadcrumbSeparator /> */}
        {pathsWithLabel.map(({ path, label }) => {

          // If the path is the current pathname, render it as plain text
          if (path === usePathname()) {
            return (
              <BreadcrumbItem key={path}>
                <BreadcrumbPage className="text-base" >{label}</BreadcrumbPage>
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
