"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type Role = string;

// --- Mock fetching for student attendance data ---
function fetchStudentAttendanceData(
  days: number
): Promise<Array<{ date: string; attendance: number }>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date();
      const data: Array<{ date: string; attendance: number }> = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        data.push({
          date: d.toISOString().split("T")[0],
          attendance: Math.floor(Math.random() * 50) + 1,
        });
      }
      resolve(data);
    }, 2000);
  });
}

// --- Mock fetching for educator attendance data ---
// This simulates data for multiple students with dynamic series keys.
function fetchEducatorAttendanceData(
  days: number
): Promise<
  Array<{ date: string; Alice: number; Bob: number; Charlie: number }>
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date();
      const data: Array<{
        date: string;
        Alice: number;
        Bob: number;
        Charlie: number;
      }> = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        data.push({
          date: d.toISOString().split("T")[0],
          Alice: Math.floor(Math.random() * 50) + 1,
          Bob: Math.floor(Math.random() * 50) + 1,
          Charlie: Math.floor(Math.random() * 50) + 1,
        });
      }
      resolve(data);
    }, 2000);
  });
}

// --- Chart config for student ---
const studentChartConfig = {
  attendance: {
    label: "Attendance",
    color: "blue",
  },
} satisfies ChartConfig;

interface AttendanceBarChartProps {
  role: Role;
}

export function AttendanceBarChart({ role }: AttendanceBarChartProps) {
  const [timeRange, setTimeRange] = useState("90d");
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const getDaysFromRange = (range: string) => {
    if (range === "7d") return 7;
    if (range === "30d") return 30;
    return 90;
  };

  useEffect(() => {
    const days = getDaysFromRange(timeRange);
    setLoading(true);
    if (role === "student") {
      fetchStudentAttendanceData(days).then((data) => {
        setAttendanceData(data);
        setLoading(false);
      });
    } else {
      fetchEducatorAttendanceData(days).then((data) => {
        setAttendanceData(data);
        setLoading(false);
      });
    }
  }, [timeRange, role]);

  const handleRefresh = () => {
    const days = getDaysFromRange(timeRange);
    setLoading(true);
    if (role === "student") {
      fetchStudentAttendanceData(days).then((data) => {
        setAttendanceData(data);
        setLoading(false);
      });
    } else {
      fetchEducatorAttendanceData(days).then((data) => {
        setAttendanceData(data);
        setLoading(false);
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-col items-stretch sm:flex-row sm:justify-between gap-4 p-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="h-4 w-64 rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-40 rounded bg-gray-200" />
            <div className="h-10 w-24 rounded bg-gray-200" />
          </div>
        </CardHeader>
        <CardContent className="p-6 animate-pulse">
          <div className="h-[250px] w-full rounded bg-gray-200" />
        </CardContent>
      </Card>
    );
  }

  // For educator: derive the series keys dynamically (all keys except "date")
  const educatorSeriesKeys =
    role === "educator" && attendanceData.length > 0
      ? Object.keys(attendanceData[0]).filter((key) => key !== "date")
      : [];

  // Define a palette – you can adjust the colors as needed.
  const palette = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  // For educator, assign colors from the palette (cyclically)
  const educatorSeries = educatorSeriesKeys.map((key, index) => {
    const color = palette[index % palette.length];
    return {
      key,
      color,
    };
  });

  // For student, we use the single "attendance" series
  const config = role === "student" ? studentChartConfig : {};

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch gap-2 border-b py-5 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <CardTitle>Attendance Over Time</CardTitle>
          <CardDescription>
            {role === "student"
              ? "Daily attendance for the selected period"
              : "Daily attendance for multiple students over the selected period"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 90 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={role === "student" ? studentChartConfig : {}}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={attendanceData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const d = new Date(value);
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            {role === "student" ? (
              <Bar
                dataKey="attendance"
                stackId="a"
                fill={studentChartConfig.attendance.color}
              />
            ) : (
              educatorSeries.map((series) => (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  stackId="a"
                  fill={series.color}
                />
              ))
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
