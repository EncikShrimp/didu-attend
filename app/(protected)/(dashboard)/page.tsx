"use client";

import { AttendanceLogsCard } from "@/components/dashboard/attendance-logs-card";
import { AttendanceAreaChart } from "@/components/dashboard/attendance-area-chart";
import React from "react";
import { useRequireAuth } from "@/context/AuthContext";

function Dashboard() {
  const { user } = useRequireAuth();

  const userRole = user?.user_metadata?.role || "educator";

  return (
    <div className="space-y-6">
      <AttendanceAreaChart role={userRole} />
      <AttendanceLogsCard role={userRole} />
    </div>
  );
}

export default Dashboard;
