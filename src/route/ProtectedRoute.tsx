"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ("admin" | "panelist" | "ta_member")[];
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (!allowedRoles.includes(user.role as any)) {
      router.push("/dashboard");
      return;
    }
  }, [user]);

  return <>{children}</>;
}
