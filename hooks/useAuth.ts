import { supabase } from "@/lib/supabaseClient";

export const useAuth = () => {
  async function signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async function signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  return { signIn, signUp };
};
