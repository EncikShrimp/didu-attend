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

interface ClassItem {
  id: string;
  name: string;
  status: string;
}

interface ClassListProps {
  userType: "educator" | "student";
  classes: ClassItem[];
}

export function ClassCard({ userType, classes }: ClassListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  function handleClassClick(classId: string) {
    if (userType === "educator") {
      router.push(`/dashboard/classes/${classId}/edit`);
    } else {
      router.push(`/dashboard/classes/${classId}`);
    }
  }

  function handleAddClass() {
    if (userType === "educator") {
      router.push("/dashboard/classes/create");
    } else {
      setShowModal(true);
    }
  }

  async function handleJoinClass() {
    try {
      // TODO: Implement join class logic
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Successful join class",
        description: "You have successfully joined the class",
      });
    } catch (error: any) {
      toast({
        title: "Error joining class",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* The main card */}
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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow
                  key={classItem.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleClassClick(classItem.id)}
                >
                  <TableCell className="text-sm">{classItem.id}</TableCell>
                  <TableCell className="text-sm">{classItem.name}</TableCell>
                  <TableCell className="text-sm">{classItem.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal for Student to "join" or add a class */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a New Class</DialogTitle>
          </DialogHeader>
          {/* Replace with your form or custom content */}
          <div className="p-4">
            <div className="grid gap-2 mb-2">
              <Label htmlFor="classId">Class Id</Label>
              <Input
                id="classId"
                type="text"
                placeholder="Please enter class Id"
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="mr-2"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleJoinClass} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
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
    </>
  );
}
