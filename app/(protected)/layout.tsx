"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/context/AuthContext";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  if (loading || user === null) {
    return null;
  }

  return <>{children}</>;
}
