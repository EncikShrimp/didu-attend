"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function useRequireAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsAuthenticated(false);
        router.push("/sign-in");
        return;
      }

      setIsAuthenticated(true);
    };

    checkSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        router.push("/sign-in");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [router]);

  return { isAuthenticated };
}
