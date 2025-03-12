"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ClassInfoForm() {
  // Just some local state for demonstration
  const [name, setName] = useState("Intro to Programming");
  const [description, setDescription] = useState(
    "Learn the basics of programming with JavaScript!"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you might call an API or handle supabase updates
    alert(`Class updated!\nName: ${name}\nDescription: ${description}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <Label htmlFor="className">Class Name</Label>
        <Input
          id="className"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="classDesc">Class Description</Label>
        <Textarea
          id="classDesc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
