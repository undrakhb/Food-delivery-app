import { Suspense } from "react";
import { ResetPasswordForm } from "./_features/reset-form";

// The form reads ?token= from the URL, so it must sit under a Suspense boundary.
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
