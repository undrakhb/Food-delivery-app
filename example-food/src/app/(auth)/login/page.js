"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";
import { LoginForm } from "./_features/login-form";
import { useAuth } from "@/providers/auth-provider";

const emailSchema = z.email("Invalid email. Use a format like example@email.com");

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setServerError("");
  }

  const emailValid = emailSchema.safeParse(form.email).success;
  const emailError =
    form.email.length > 0 && !emailValid
      ? "Invalid email. Use a format like example@email.com"
      : "";

  const canSubmit = emailValid && form.password.length > 0 && !submitting;

  const errors = {
    email: emailError,
    password: serverError,
  };

  async function onSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    const result = await login(form.email, form.password);
    setSubmitting(false);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push(result.user?.role === "admin" ? "/admin" : "/");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex size-10 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="mt-10">
            <h1 className="text-3xl font-bold tracking-tight">Log in</h1>
            <p className="mt-2 text-muted-foreground">
              Log in to enjoy your favorite dishes.
            </p>
          </div>

          <LoginForm
            values={form}
            errors={errors}
            canSubmit={canSubmit}
            submitting={submitting}
            onChange={setField}
            onSubmit={onSubmit}
          />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1400&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
