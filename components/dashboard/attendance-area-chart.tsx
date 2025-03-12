"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { format } from "date-fns";

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

export type Role = "student" | "educator";

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

interface AttendanceAreaChartProps {
  role: Role;
}

export function AttendanceAreaChart({ role }: AttendanceAreaChartProps) {
  const [timeRange, setTimeRange] = useState("90d");
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const getDaysFromRange = (range: string) => {
    if (range === "7d") return 7;
    if (range === "30d") return 30;
    return 90;
  };

  React.useEffect(() => {
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

  // Define the palette using your specified colors
  const palette = [
    "hsl(var(--chart-1))", // chrome
    "hsl(var(--chart-2))", // safari
    "hsl(var(--chart-3))", // firefox
    "hsl(var(--chart-4))", // edge
    "hsl(var(--chart-5))", // other
  ];

  // For educator, assign colors from the palette (cyclically)
  const educatorSeries = educatorSeriesKeys.map((key, index) => {
    const color = palette[index % palette.length];
    return {
      key,
      color,
      gradientId: `fill-${key}`,
    };
  });

  // Build a dynamic educator chart config using these colors
  const dynamicEducatorChartConfig: ChartConfig = {};
  educatorSeries.forEach((series) => {
    dynamicEducatorChartConfig[series.key] = {
      label: series.key,
      color: series.color,
    };
  });

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
          config={
            role === "student" ? studentChartConfig : dynamicEducatorChartConfig
          }
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={attendanceData} margin={{ left: 12, right: 12 }}>
            <defs>
              {role === "student" ? (
                <linearGradient id="fillAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="blue" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="blue" stopOpacity={0.1} />
                </linearGradient>
              ) : (
                educatorSeries.map((series) => (
                  <linearGradient
                    key={series.key}
                    id={series.gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={series.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={series.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))
              )}
            </defs>
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
              <Area
                dataKey="attendance"
                type="natural"
                fill="url(#fillAttendance)"
                stroke="blue"
              />
            ) : (
              educatorSeries.map((series) => (
                <Area
                  key={series.key}
                  dataKey={series.key}
                  type="natural"
                  fill={`url(#${series.gradientId})`}
                  stroke={series.color}
                />
              ))
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
