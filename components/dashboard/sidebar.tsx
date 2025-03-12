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
  const { user } = useRequireAuth();

  const userData = {
    name: user?.user_metadata.firstName || "shadcn",
    email: user?.email || "m@example.com",
    avatar: user?.user_metadata.avatar_url || "/avatars/shadcn.jpg",
  };

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
        {/* Only show the class card if the sidebar is expanded */}
        <div className="p-2 pt-0 space-y-8">
          {user?.user_metadata?.role === "educator" && (
            <ClassCard userType="educator" classes={educatorMockData} />
          )}

          {user?.user_metadata?.role === "student" && (
            <ClassCard userType="student" classes={studentMockData} />
          )}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
