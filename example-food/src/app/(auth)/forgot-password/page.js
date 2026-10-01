"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";

const emailSchema = z.email("Invalid email. Use a format like example@email.com");

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const emailValid = emailSchema.safeParse(email).success;
  const emailError =
    email.length > 0 && !emailValid
      ? "Invalid email. Use a format like example@email.com"
      : "";

  function sendLink() {
    console.log("reset link for:", email);
    setSent(true);
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!emailValid) return;
    sendLink();
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

          {sent ? (
            <>
              <div className="mt-10">
                <h1 className="text-3xl font-bold tracking-tight">
                  Check your email
                </h1>
                <p className="mt-2 text-muted-foreground">
                  We sent a password reset link to{" "}
                  <span className="text-foreground">{email}</span>.
                </p>
              </div>

              <button
                type="button"
                onClick={sendLink}
                className="mt-8 h-12 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Resend link
              </button>
            </>
          ) : (
            <>
              <div className="mt-10">
                <h1 className="text-3xl font-bold tracking-tight">
                  Reset your password
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Enter your email to receive a password reset link.
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(emailError)}
                    className="h-12 w-full rounded-lg border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20"
                  />
                  {emailError ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {emailError}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={!emailValid}
                  className="h-12 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                  Send link
                </button>
              </form>
            </>
          )}

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
