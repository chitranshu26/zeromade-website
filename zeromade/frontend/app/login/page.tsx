"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

/* ===============================
   RESPONSE TYPE
================================ */

type AuthResponse = {
  success: boolean;
  user?: {
    role: string;
  };
};

/* ===============================
   COMPONENT
================================ */

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginRole, setLoginRole] = useState<"user" | "admin">("user");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     SUBMIT HANDLER
  ================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let res: AuthResponse;

      if (mode === "signup") {
        res = (await api.register({
          name,
          email,
          password,
        })) as AuthResponse;
      } else {
        res = (await api.login({
          email,
          password,
          role: loginRole,
        })) as AuthResponse;
      }

      if (res.success && res.user) {
        if (res.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }

        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  ================================ */

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-8 sm:px-6 md:min-h-[calc(100dvh-4rem)]">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8 md:max-w-[28rem]">

        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
          {mode === "login" ? "Login" : "Sign up"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === "signup" && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            required
          />

          {mode === "login" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Login as
              </label>

              <select
                value={loginRole}
                onChange={(e) =>
                  setLoginRole(e.target.value as "user" | "admin")
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <p className="text-xs text-gray-500">
                Select User or Admin. Access is denied if role does not match.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3.5 text-base font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Sign up"}
          </button>

        </form>

        <p className="mt-6 text-sm text-gray-600">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}

          <button
            type="button"
            className="font-medium text-black underline"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </p>

        <p className="mt-3 text-sm">
          <Link href="/" className="text-gray-500 hover:text-black">
            Back to home
          </Link>
        </p>

      </div>
    </main>
  );
}
