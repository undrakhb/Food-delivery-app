"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Za-z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);

const inputClass =
  "h-12 w-full rounded-lg border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20";

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strong = passwordSchema.safeParse(password).success;
  const matches = password.length > 0 && password === confirm;

  let error = "";
  if (password.length > 0 && !strong) {
    error = "Weak password. Use numbers and symbols.";
  } else if (confirm.length > 0 && !matches) {
    error = "Passwords didn't match. Try again.";
  }

  const canSubmit = strong && matches;
  const type = showPassword ? "text" : "password";

  function onSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    console.log("reset password:", { token, password });
    router.push("/login");
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
            <h1 className="text-3xl font-bold tracking-tight">
              Create new password
            </h1>
            <p className="mt-2 text-muted-foreground">
              Set a new password with a combination of letters and numbers for
              better security.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <input
              type={type}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(error)}
              className={inputClass}
            />

            <div>
              <input
                type={type}
                name="confirm"
                placeholder="Confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                aria-invalid={Boolean(error)}
                className={inputClass}
              />
              {error ? (
                <p className="mt-1.5 text-sm text-destructive">{error}</p>
              ) : null}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((current) => !current)}
                className="size-4 accent-primary"
              />
              Show password
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 h-12 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              Create password
            </button>
          </form>
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
