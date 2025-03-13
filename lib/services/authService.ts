// /lib/services/authService.ts
import { supabase } from "@/lib/supabaseClient";
import { Profile, fetchProfile } from "./profileService";

export async function signUpUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  // Create auth user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { data: null, error: signUpError };
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    return { data: null, error: new Error("No user returned from signUp.") };
  }

  // Insert profile data (you could also create a dedicated function for this)
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        role: "student", // Adjust this value according to your check constraint
      },
    ])
    .single();

  if (profileError) {
    return { data: null, error: profileError };
  }

  return {
    data: {
      user: signUpData.user,
      profile: profileData,
    },
    error: null,
  };
}

export async function updateAuthUserAndProfile(
  updates: { email?: string; password?: string },
  profileUpdates: Partial<Profile>
) {
  // First, update the auth user if needed
  let authError = null;
  if (updates.email || updates.password) {
    const { error } = await supabase.auth.updateUser({
      ...(updates.email && { email: updates.email }),
      ...(updates.password && { password: updates.password }),
    });
    if (error) {
      authError = error;
    }
  }

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error("No user session found."),
    };
  }

  // Update the profile
  const { data: updatedProfile, error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdates)
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { data: null, error: profileError };
  }

  return { data: { user, profile: updatedProfile }, error: authError || null };
}
