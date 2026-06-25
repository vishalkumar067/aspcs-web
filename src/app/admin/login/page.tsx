"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock, Mail, GraduationCap } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const router  = useRouter();
  const login   = useAuthStore((s) => s.login);

  const { register, handleSubmit, formState: { errors } } =
    useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(data),
        }
      );
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Login failed");

      login(json.data.user, json.data.tokens.accessToken);
      toast.success(`Welcome back, ${json.data.user.name}!`);
      router.push(json.data.user.role === "TEACHER" ? "/admin/progress-reports" : "/admin/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(107,15,26,0.7),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: "linear-gradient(rgba(196,30,58,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,0.07) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-crimson to-brand-maroon shadow-glow-crimson">
            <GraduationCap size={28} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">ASPCS Admin</h1>
          <p className="mt-1 text-sm text-brand-slate">Sign in to manage your school website</p>
        </div>

        {/* Form card */}
        <div className="rounded-3xl border border-brand-crimson/20 bg-brand-black/80 p-8 shadow-glass backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">Email Address</label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="admin@aspcs.edu.in"
                  className={cn(
                    "w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition-all",
                    errors.email
                      ? "border-red-500/50 focus:border-red-500/70 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/10 focus:border-brand-crimson/60 focus:ring-2 focus:ring-brand-crimson/20"
                  )}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "w-full rounded-xl border bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder:text-white/20 outline-none transition-all",
                    errors.password
                      ? "border-red-500/50 focus:border-red-500/70"
                      : "border-white/10 focus:border-brand-crimson/60 focus:ring-2 focus:ring-brand-crimson/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-sm"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

         
        </div>
      </motion.div>
    </div>
  );
}
