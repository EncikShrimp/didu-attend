"use client";

import React, { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/dashboard/date-picker-range";
import { AttendanceLog, fetchAttendanceLogs } from "@/lib/fetchAttendanceLogs";

interface AttendanceLogsCardProps {
  role: string;
}

export function AttendanceLogsCard({ role }: AttendanceLogsCardProps) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);

  // Date range
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2025-03-01"),
    to: new Date("2025-03-05"),
  });

  // Sorting
  const defaultSort = "latest-date";
  const [sortOption, setSortOption] = useState(defaultSort);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const logsPerPage = 8;

  // Fetch logs on mount and when role changes
  useEffect(() => {
    setLoading(true);
    fetchAttendanceLogs(role).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, [role]);

  // Filter & sort
  const filteredAndSortedLogs = React.useMemo(() => {
    let filteredLogs = [...logs];

    // Filter by date range
    if (dateRange?.from && dateRange.to) {
      const start = dateRange.from.getTime();
      const end = dateRange.to.getTime();
      filteredLogs = filteredLogs.filter((log) => {
        const logDate = new Date(log.date).getTime();
        return logDate >= start && logDate <= end;
      });
    }

    // Sort logic
    switch (sortOption) {
      case "latest-date":
        filteredLogs.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        break;
      case "oldest-date":
        filteredLogs.sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case "name":
        // For student role: sort by className
        filteredLogs.sort((a, b) => a.className.localeCompare(b.className));
        break;
      case "student-name":
        // For educator: sort by studentName
        filteredLogs.sort((a, b) =>
          (a.studentName ?? "").localeCompare(b.studentName ?? "")
        );
        break;
      case "class-name":
        filteredLogs.sort((a, b) => a.className.localeCompare(b.className));
        break;
      default:
        break;
    }

    return filteredLogs;
  }, [logs, dateRange, sortOption]);

  // Pagination
  const startIdx = (page - 1) * logsPerPage;
  const endIdx = startIdx + logsPerPage;
  const paginatedLogs = filteredAndSortedLogs.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredAndSortedLogs.length / logsPerPage);

  // Loading skeleton
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
          <div>
            <div className="h-4 w-40 rounded bg-gray-200 mb-2" />
            <div className="h-3 w-52 rounded bg-gray-200" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-44 rounded bg-gray-200" />
            <div className="h-8 w-24 rounded bg-gray-200" />
          </div>
        </CardHeader>
        <CardContent className="p-4 animate-pulse">
          <div className="h-36 w-full rounded bg-gray-200" />
        </CardContent>
        <div className="flex items-center justify-end p-4 animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="h-4 w-16 bg-gray-200 rounded" />
            <span className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {role === "student" ? (
            <>
              <CardTitle>Your Attendance Logs</CardTitle>
              <CardDescription>
                View logs of your attendance across different classes
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle>All Attendance Logs</CardTitle>
              <CardDescription>
                View logs of attendance for all students
              </CardDescription>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <DatePickerWithRange value={dateRange} onChange={setDateRange} />
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest-date">Latest Date</SelectItem>
              <SelectItem value="oldest-date">Oldest Date</SelectItem>
              {role === "student" && (
                <SelectItem value="name">Class Name</SelectItem>
              )}
              {role === "educator" && (
                <>
                  <SelectItem value="student-name">Student Name</SelectItem>
                  <SelectItem value="class-name">Class Name</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {role === "educator" ? (
                <>
                  <TableHead>Class ID</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Class ID</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  {role === "educator" ? (
                    <>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.className}</TableCell>
                      <TableCell>{log.studentId}</TableCell>
                      <TableCell>{log.studentName}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.time}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.className}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.time}</TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={role === "educator" ? 6 : 4}
                  className="text-center"
                >
                  No attendance logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <div className="flex items-center justify-end p-2 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span>
            Page {page} of {totalPages || 1}
          </span>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, totalPages === 0 ? 1 : totalPages)
              )
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}
