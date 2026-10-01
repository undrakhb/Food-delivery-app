import { FieldError } from "../_components/field-error";

const inputClass =
  "h-12 w-full rounded-lg border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20";

export function LoginForm({
  values,
  errors,
  canSubmit,
  submitting,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          className={inputClass}
        />
        <FieldError>{errors.email}</FieldError>
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={values.password}
          onChange={(e) => onChange("password", e.target.value)}
          aria-invalid={Boolean(errors.password)}
          className={inputClass}
        />
        <FieldError>{errors.password}</FieldError>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 h-12 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
      >
        {submitting ? "Loading..." : "Let's Go"}
      </button>
    </form>
  );
}
