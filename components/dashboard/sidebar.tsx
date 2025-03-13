"use client";

import * as React from "react";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useRequireAuth } from "@/context/AuthContext";
import { ClassCard } from "./class-card";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useRequireAuth();

  const userData = {
    name: profile?.first_name || "shadcn",
    email: profile?.email || "m@example.com",
    avatar: profile?.avatar || "/avatars/shadcn.jpg",
  };
  const userRole = profile?.role || "student";

  const educatorMockData = [
    { id: "C101", name: "Math 101", status: "Active" },
    { id: "C202", name: "Physics 202", status: "Archived" },
  ];

  const studentMockData = [
    { id: "C101", name: "Math 101", status: "Enrolled" },
    { id: "C303", name: "Chemistry 303", status: "Enrolled" },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent>
        <div className="p-2 pt-0 space-y-8">
          {userRole === "educator" && (
            <ClassCard userType="educator" userId={profile?.id || ""} />
          )}
          {userRole === "student" && (
            <ClassCard userType="student" userId={profile?.id || ""} />
          )}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
