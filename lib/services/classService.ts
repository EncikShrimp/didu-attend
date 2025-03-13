import { supabase } from "@/lib/supabaseClient";

export interface ClassData {
  class_id: string;
  educator_id: string;
  name: string;
  description: string;
}

interface ClassStudentRow {
  classes: ClassData;
}

export async function getClassesByEducator(
  userId: string
): Promise<ClassData[]> {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("educator_id", userId);

  if (error) {
    throw error;
  }
  return data as ClassData[];
}

export async function getClassesByStudent(
  studentId: string
): Promise<ClassData[]> {
  const { data, error } = await supabase
    .from<ClassStudentRow>("class_students")
    .select("classes(*)")
    .eq("student_id", studentId);

  if (error) throw error;
  if (!data) return [];

  // Now TypeScript knows data is ClassStudentRow[], so row.classes is ClassData
  return data.map((row) => row.classes);
}

export async function createClass(
  educatorId: string,
  name: string,
  description: string
): Promise<ClassData> {
  const { data, error } = await supabase
    .from("classes")
    .insert([
      {
        educator_id: educatorId,
        name,
        description,
      },
    ])
    .single();

  if (error) {
    throw error;
  }

  // data should match ClassData shape
  return data as ClassData;
}

export async function getClassById(classId: string): Promise<ClassData | null> {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("class_id", classId)
    .single();

  if (error) {
    console.error("Error fetching class by ID:", error);
    return null;
  }

  return data as ClassData;
}

export async function updateClassById(
  classId: string,
  updates: Partial<ClassData>
): Promise<ClassData | null> {
  const { data, error } = await supabase
    .from("classes")
    .update(updates)
    .eq("class_id", classId)
    .single();

  if (error) {
    console.error("Error updating class:", error);
    throw error;
  }

  return data as ClassData;
}
