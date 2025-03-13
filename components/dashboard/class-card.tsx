"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader2, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import {
  createClass,
  getClassesByEducator,
  getClassesByStudent,
  ClassData,
} from "@/lib/services/classService";

interface ClassCardProps {
  userType: "educator" | "student";
  userId: string;
}

// Helper function to truncate an ID to 6 characters followed by two asterisks
function truncateId(id: string): string {
  return id.length > 6 ? id.slice(0, 6) + "**" : id;
}

// Define some mock data for student mode
const mockStudentClasses: ClassData[] = [
  {
    class_id: "abc123def456",
    educator_id: "edu001xyz789",
    name: "Intro to Mathematics",
    description: "Learn basic math concepts.",
  },
  {
    class_id: "ghi789jkl012",
    educator_id: "edu002mno345",
    name: "History 101",
    description: "An overview of world history.",
  },
];

export function ClassCard({ userType, userId }: ClassCardProps) {
  const router = useRouter();
  const { toast } = useToast();

  // State to hold classes
  const [classes, setClasses] = React.useState<ClassData[]>([]);

  // States for modals and loading flags
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [joinLoading, setJoinLoading] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);

  // Form fields for creating a new class
  const [className, setClassName] = React.useState("");
  const [classDescription, setClassDescription] = React.useState("");

  // Fetch classes on mount or when userType/userId changes
  React.useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        let data: ClassData[] = [];
        if (userType === "educator") {
          data = await getClassesByEducator(userId);
        } else {
          data = await getClassesByStudent(userId);
          // If no classes from the API, use mock data for students
          if (data.length === 0) {
            data = mockStudentClasses;
          }
        }
        setClasses(data);
      } catch (error: any) {
        console.error("Error fetching classes:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [userType, userId, toast]);

  // Navigate to class details or edit page (only for educators)
  function handleClassClick(classId: string) {
    router.push(`/class/${classId}`);
  }

  // Decide which modal to open (join or create)
  function handleAddClass() {
    if (userType === "educator") {
      setShowCreateModal(true);
    } else {
      setShowJoinModal(true);
    }
  }

  // Student "Join Class" logic
  async function handleJoinClass() {
    try {
      setJoinLoading(true);
      // TODO: Replace with actual join logic (e.g., insert into join table)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Successful join class",
        description: "You have successfully joined the class",
      });
      setShowJoinModal(false);

      // Re-fetch classes for student (if needed)
      const data = await getClassesByStudent(userId);
      setClasses(data.length ? data : mockStudentClasses);
    } catch (error: any) {
      toast({
        title: "Error joining class",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setJoinLoading(false);
    }
  }

  // Educator "Create Class" logic
  async function handleCreateClass() {
    try {
      setCreateLoading(true);
      await createClass(userId, className, classDescription);

      toast({
        title: "Class Created",
        description: `Successfully created class`,
      });

      // Clear form fields and close modal
      setClassName("");
      setClassDescription("");
      setShowCreateModal(false);

      // Re-fetch classes for educator
      const data = await getClassesByEducator(userId);
      setClasses(data);
    } catch (error: any) {
      toast({
        title: "Error creating class",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  }

  return (
    <>
      {/* Main card */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {userType === "educator" ? "Classes Created" : "Classes Enrolled"}
          </CardTitle>
          <Button variant="ghost" onClick={handleAddClass}>
            <Plus />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class ID</TableHead>
                <TableHead>Class Name</TableHead>
                <TableHead>Educator ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow
                  key={classItem.class_id}
                  className={`${
                    userType === "educator"
                      ? "cursor-pointer hover:bg-muted/50"
                      : ""
                  }`}
                  onClick={
                    userType === "educator"
                      ? () => handleClassClick(classItem.class_id)
                      : undefined
                  }
                >
                  <TableCell className="text-sm">
                    {truncateId(classItem.class_id)}
                  </TableCell>
                  <TableCell className="text-sm">{classItem.name}</TableCell>
                  <TableCell className="text-sm">
                    {truncateId(classItem.educator_id)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal for Student to join a class */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a New Class</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="grid gap-2 mb-2">
              <Label htmlFor="classId">Class Id</Label>
              <Input id="classId" type="text" placeholder="Enter class Id" />
            </div>
            <div className="flex justify-end">
              <Button
                className="mr-2"
                variant="outline"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleJoinClass} disabled={joinLoading}>
                {joinLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Please wait
                  </>
                ) : (
                  "Join Class"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for Educator to create a new class */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Class</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="grid gap-2 mb-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                type="text"
                placeholder="Enter class name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="classDescription">Class Description</Label>
              <Input
                id="classDescription"
                type="text"
                placeholder="Enter class description"
                value={classDescription}
                onChange={(e) => setClassDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="mr-2"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateClass} disabled={createLoading}>
                {createLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Class"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
