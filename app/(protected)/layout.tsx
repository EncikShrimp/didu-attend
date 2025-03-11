"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/context/AuthContext";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading } = useRequireAuth();
  const router = useRouter();

  if (loading === true) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    router.push("/sign-in");
    return null;
  }

  return <>{children}</>;
}
