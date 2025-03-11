import { supabase } from "@/lib/supabaseClient";

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
        data: { firstName, lastName }
      }
    });
  }

  return { signIn, signUp };
};
