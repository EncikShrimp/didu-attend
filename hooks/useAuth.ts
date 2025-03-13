import { supabase } from "@/lib/supabaseClient";
import {
  signUpUser,
  updateAuthUserAndProfile,
} from "@/lib/services/authService";

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
    return await signUpUser(email, password, firstName, lastName);
  }

  async function updateProfile({
    email,
    password,
    username,
    firstName,
    lastName,
  }: UpdateProfileArgs) {
    // Prepare the data for Auth update (email & password) and Profile update
    const authUpdates = { email, password };
    const profileUpdates: Record<string, any> = {
      ...(username && { username }),
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
      ...(email && { email }), // keep email in sync
    };

    return await updateAuthUserAndProfile(authUpdates, profileUpdates);
  }

  async function logout() {
    return await supabase.auth.signOut();
  }

  return { signIn, signUp, updateProfile, logout };
};
