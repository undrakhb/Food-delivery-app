"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";
import { StepOne } from "./_features/step-one";
import { StepTwo } from "./_features/step-two";
import { useAuth } from "@/providers/auth-provider";

const emailSchema = z.email("Invalid email. Use a format like example@email.com");
const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Za-z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);

const HEADINGS = {
  1: {
    title: "Create your account",
    subtitle: "Sign up to explore your favorite dishes.",
  },
  2: {
    title: "Create a strong password",
    subtitle: "Create a strong password with letters, numbers.",
  },
};

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setServerError("");
  };

  const emailValid = emailSchema.safeParse(form.email).success;
  const emailError =
    form.email.length > 0 && !emailValid
      ? "Invalid email. Use a format like example@email.com"
      : "";

  const passwordStrong = passwordSchema.safeParse(form.password).success;
  const passwordsMatch =
    form.password.length > 0 && form.password === form.confirm;

  let passwordError = "";
  if (form.password.length > 0 && !passwordStrong) {
    passwordError = "Weak password. Use numbers and symbols.";
  } else if (form.confirm.length > 0 && !passwordsMatch) {
    passwordError = "Passwords didn't match. Try again.";
  }

  const canContinue =
    step === 1 ? emailValid : passwordStrong && passwordsMatch;

  function handleBack() {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!canContinue || loading) return;

    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setServerError("");

    const result = await signup(form.email, form.password);

    if (!result.success) {
      setServerError(result.error);
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="flex size-10 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="mt-10">
            <h1 className="text-3xl font-bold tracking-tight">
              {HEADINGS[step].title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {HEADINGS[step].subtitle}
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            {step === 1 ? (
              <StepOne
                value={form.email}
                error={emailError}
                onChange={(value) => setField("email", value)}
              />
            ) : (
              <StepTwo
                password={form.password}
                confirm={form.confirm}
                showPassword={showPassword}
                error={passwordError}
                onChange={setField}
                onToggleShow={() => setShowPassword((current) => !current)}
              />
            )}

            {serverError ? (
              <p className="text-sm font-medium text-destructive">{serverError}</p>
            ) : null}

            <button
              type="submit"
              disabled={!canContinue || loading}
              className="h-12 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              {loading ? "Creating account..." : "Let's Go"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Log in
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