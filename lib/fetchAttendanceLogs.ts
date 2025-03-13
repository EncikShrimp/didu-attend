export interface AttendanceLog {
  id: string;
  // For both student and educator
  className: string;
  date: string;
  time: string;

  // Educator-only fields (optional)
  studentId?: string;
  studentName?: string;
}

// Mock fetch function that returns different data depending on role
export function fetchAttendanceLogs(role: string): Promise<AttendanceLog[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === "student") {
        // Simulate logs for a single user
        const logs: AttendanceLog[] = [
          {
            id: "101",
            className: "Intro to React",
            date: "2025-03-01",
            time: "09:00 AM",
          },
          {
            id: "102",
            className: "Advanced Vue",
            date: "2025-03-05",
            time: "10:00 AM",
          },
          {
            id: "103",
            className: "Angular Basics",
            date: "2025-03-02",
            time: "02:00 PM",
          },
        ];
        // Duplicate them to simulate more
        const duplicated = Array.from({ length: 15 }, (_, i) => ({
          ...logs[i % logs.length],
          id: String(i + 101),
        }));
        resolve(duplicated);
      } else {
        // role === "educator"
        // Multiple students
        const baseLogs: AttendanceLog[] = [
          {
            id: "1",
            studentId: "S001",
            studentName: "Alice Johnson",
            className: "Intro to React",
            date: "2025-03-01",
            time: "09:00 AM",
          },
          {
            id: "2",
            studentId: "S002",
            studentName: "Bob Smith",
            className: "Advanced Vue",
            date: "2025-03-05",
            time: "10:00 AM",
          },
          {
            id: "3",
            studentId: "S003",
            studentName: "Charlie Brown",
            className: "Angular Basics",
            date: "2025-03-02",
            time: "02:00 PM",
          },
        ];

        const logs = Array.from({ length: 25 }, (_, i) => ({
          ...baseLogs[i % baseLogs.length],
          id: String(i + 1),
        }));
        resolve(logs);
      }
    }, 2000); // 2-second delay
  });
}
