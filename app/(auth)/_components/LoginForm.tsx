//login form code
 "use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";

export default function LoginForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });
    const [pending, startTransition] = useTransition();

    const submit = async (values: LoginData) => {
        startTransition(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/dashboard");

        });
        console.log("login", values);
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="email">Enter your email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-red-500"
                    {...register("email")}
                    placeholder="you@example.com"
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="password">Enter your password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-red-500"
                    {...register("password")}
                    placeholder="••••••"
                />
                {errors.password?.message && (
                    <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-10 w-full rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
            >
                {isSubmitting || pending ? "Signing in..." : "Sign in"}
            </button>

            <div className="mt-1 text-center text-sm">
                Don't have an account? <Link href="/register" className="font-semibold text-red-600 hover:underline">Sign Up</Link>
            </div>
        </form>
    );
}
