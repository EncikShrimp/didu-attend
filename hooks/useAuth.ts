import { supabase } from "@/lib/supabaseClient";

type UpdateProfileArgs = {
  email?: string;
  password?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export const useAuth = () => {
  async function signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName },
      },
    });
  }

  async function updateProfile({
    email,
    password,
    username,
    firstName,
    lastName,
  }: UpdateProfileArgs) {
    const updatePayload: Parameters<typeof supabase.auth.updateUser>[0] = {};

    if (email) updatePayload.email = email;
    if (password) updatePayload.password = password;

    // Only include metadata if provided
    if (username || firstName || lastName) {
      updatePayload.data = {
        ...(username && { username }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      };
    }

    return await supabase.auth.updateUser(updatePayload);
  }

  return { signIn, signUp, updateProfile };
};
