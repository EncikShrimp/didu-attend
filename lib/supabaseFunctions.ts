// lib/supabaseFunctions.ts

import { supabase } from "./supabaseClient";

export async function fetchClassById(classId: string) {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateClass(
  classId: string,
  updates: { name?: string; description?: string }
) {
  const { error } = await supabase
    .from("classes")
    .update(updates)
    .eq("id", classId);

  if (error) throw error;
}

export async function fetchClassMembers(
  classId: string,
  page: number,
  pageSize: number
) {
  // 1) Count total
  const { count, error: countError } = await supabase
    .from("class_members")
    .select("*", { count: "exact", head: true })
    .eq("class_id", classId);

  if (countError) throw countError;

  // 2) Data with range
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error } = await supabase
    .from("class_members")
    .select("id, user_id, user:users(*)")
    .eq("class_id", classId)
    .range(start, end);

  if (error) throw error;

  return {
    members: data ?? [],
    totalCount: count ?? 0,
  };
}

export async function removeClassMember(memberId: number) {
  const { error } = await supabase
    .from("class_members")
    .delete()
    .eq("id", memberId);

  if (error) throw error;
}

export async function inviteUsersToClass(classId: string, userIds: string[]) {
  if (!userIds.length) return;
  const rows = userIds.map((userId) => ({
    class_id: classId,
    user_id: userId,
  }));

  const { error } = await supabase.from("class_members").insert(rows);
  if (error) throw error;
}

export async function fetchExistingMemberIds(classId: string) {
  const { data, error } = await supabase
    .from("class_members")
    .select("user_id")
    .eq("class_id", classId);

  if (error) throw error;
  return data?.map((m) => m.user_id) ?? [];
}

export async function searchUsers(
  searchTerm: string,
  excludeIds: string[],
  limit = 20
) {
  let query = supabase
    .from("users")
    .select("id, email, first_name, last_name")
    .limit(limit);

  if (searchTerm) {
    query = query.ilike("email", `%${searchTerm}%`);
  }

  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
