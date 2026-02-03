"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

/**
 * Admin layout: authorization happens BEFORE any admin page is shown.
 * - Calls GET /api/auth/me (JWT required)
 * - If not logged in or role !== "admin" → redirect to /login
 * - Even if user manually types /admin or /admin/dashboard, they are blocked
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getMe();
        if (cancelled) return;
        if (res.success && res.user && res.user.role === "admin") {
          setStatus("allowed");
        } else {
          setStatus("denied");
          router.replace("/login");
        }
      } catch {
        if (cancelled) return;
        setStatus("denied");
        router.replace("/login");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  if (status === "checking") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-gray-500">Checking access...</p>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-center text-gray-500">Access denied. Redirecting to login...</p>
      </main>
    );
  }

  return <>{children}</>;
}
