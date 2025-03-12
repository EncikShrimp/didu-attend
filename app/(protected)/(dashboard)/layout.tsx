"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function buildBreadcrumbs(path: string) {
    const segments = path.split("/").filter(Boolean);
    let fullPath = "";
    return segments.map((segment) => {
      fullPath += `/${segment}`;
      return {
        name: decodeURIComponent(segment),
        href: fullPath,
      };
    });
  }

  const breadcrumbs = buildBreadcrumbs(pathname || "");

  function segmentToTitle(segment: string) {
    if (segment.startsWith("[")) {
      return segment.replace("[", "").replace("]", "");
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href={crumb.href}>
                        {segmentToTitle(crumb.name)}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            {/* ThemeToggle placed at far right */}
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
