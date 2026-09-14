"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGate({ children }) {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = window.localStorage.getItem("gitpulse-auth");
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [router]);

  return children;
}
