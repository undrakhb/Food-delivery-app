export function StepTwo({
  password,
  confirm,
  showPassword,
  error,
  onChange,
  onToggleShow,
}) {
  const type = showPassword ? "text" : "password";
  const inputClass =
    "h-12 w-full rounded-lg border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20";

  return (
    <div className="flex flex-col gap-4">
      <input
        type={type}
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => onChange("password", e.target.value)}
        aria-invalid={Boolean(error)}
        className={inputClass}
      />

      <div>
        <input
          type={type}
          name="confirm"
          placeholder="Confirm"
          value={confirm}
          onChange={(e) => onChange("confirm", e.target.value)}
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
          onChange={onToggleShow}
          className="size-4 accent-primary"
        />
        Show password
      </label>
    </div>
  );
}
