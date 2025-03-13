"use client";

import { AttendanceLogsCard } from "@/components/dashboard/attendance-logs-card";
import { AttendanceBarChart } from "@/components/dashboard/attendance-bar-chart";
import React from "react";
import { useRequireAuth } from "@/context/AuthContext";

function Dashboard() {
  const { profile } = useRequireAuth();

  const userRole = profile?.role || "educator";

  return (
    <div className="space-y-6">
      <AttendanceBarChart role={userRole} />
      <AttendanceLogsCard role={userRole} />
    </div>
  );
}

export default Dashboard;
