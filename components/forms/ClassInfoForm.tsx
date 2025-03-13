"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { getClassById, updateClassById } from "@/lib/services/classService";
import { useToast } from "@/hooks/use-toast";

export default function ClassInfoForm() {
  const { id } = useParams(); // Grab the [id] route param
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch class data when component mounts
  useEffect(() => {
    if (!id) return;

    async function fetchClass() {
      try {
        setLoading(true);
        const classData = await getClassById(id as string);
        if (classData) {
          setName(classData.name || "");
          setDescription(classData.description || "");
        }
      } catch (error) {
        console.error("Error fetching class:", error);
        toast({
          title: "Error fetching class",
          description: "Unable to load class data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchClass();
  }, [id, toast]);

  // Handle form submit to update class
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) {
      toast({
        title: "Error",
        description: "No class ID found",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);
      await updateClassById(id as string, { name, description });
      toast({
        title: "Class Updated",
        description: "Class updated successfully!",
      });
    } catch (error: any) {
      console.error("Error updating class:", error);
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  }

  // Show a skeleton UI while loading data
  if (loading) {
    return (
      <div className="space-y-4 max-w-xl">
        <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    );
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
      <Button type="submit" disabled={updating}>
        {updating ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
