"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns, Member } from "./columns";

const mockData: Member[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
  },
  {
    id: "user-3",
    name: "Alice Wonderland",
    email: "alice@wonder.com",
    status: "banned",
  },
];

export default function ClassMembersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Members</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={mockData} />
      </CardContent>
    </Card>
  );
}
