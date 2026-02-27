/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { handleLogin } from "@/lib/action/auth-action";
import { LoginData, loginSchema } from "../schema";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginData) => {
    setError("");

    try {
      const res = await handleLogin(data);
      console.log("Login response:", res);

      if (!res.success) {
        setError(res.message || "Login Failed");
        return;
      }

      /* ✅ SAVE USER INFO TO LOCAL STORAGE */
      if (res.user) {
        const user = res.user as any;

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user._id || user.id,
            _id: user._id || user.id,
            name: user.username || user.name,
            email: user.email,
            role: user.role,
          })
        );
      }

      /* ✅ Wait for backend to set cookie (VERY IMPORTANT for auth middleware) */
      await new Promise((resolve) => setTimeout(resolve, 200));

      /* ✅ Hard Redirect (prevents middleware/session issue) */
      if (res.user?.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (res.user?.role === "user") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••"
          className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}

        {/* ✅ Forgot Password */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-xs text-pink-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="h-10 w-full rounded-md bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 disabled:opacity-60"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>

      {/* Register */}
      <div className="mt-2 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-pink-500 hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}
