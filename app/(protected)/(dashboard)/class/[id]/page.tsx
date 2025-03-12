"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ClassInfoForm from "@/components/forms/ClassInfoForm";
import ClassMembersCard from "@/components/class/class-members-card";

export default function ClassPage() {
  return (
    <div className="space-y-6">
      {/* Class Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Class Info</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassInfoForm />
        </CardContent>
      </Card>

      {/* Class Members Card (with DataTable) */}
      <ClassMembersCard />
    </div>
  );
}
