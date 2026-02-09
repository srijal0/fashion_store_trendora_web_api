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
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await handleLogin(data);

      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }

      // ✅ Ensure cookie is set by backend
      // handleLogin should set "auth_token" cookie with JWT

      const role = res.user?.role || res.data?.role;
      // LoginForm.tsx
const redirectPath = role === "admin" ? "/admin/dashboard" : "/dashboard";


      startTransition(() => {
        router.push(redirectPath);
      });
    } catch (err: Error | any) {
      setError(err.message || "Login Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">
          Enter your email
        </label>
        <input
          id="email"
          type="email"
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-pink-500"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">
          Enter your password
        </label>
        <input
          id="password"
          type="password"
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-pink-500"
          placeholder="••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-10 w-full rounded-md bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <div className="mt-1 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-pink-600 hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}
