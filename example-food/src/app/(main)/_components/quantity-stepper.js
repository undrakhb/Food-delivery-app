import { Minus, Plus } from "lucide-react";

const variants = {
  // Outlined circles, used in the food dialog.
  large: {
    button:
      "size-11 rounded-full border border-zinc-200 hover:bg-zinc-100 disabled:opacity-40",
    value: "w-8 text-lg",
  },
  // Bare icons, used in the cart.
  small: {
    button: "size-9 rounded-full hover:bg-zinc-100 disabled:opacity-40",
    value: "w-6 text-lg",
  },
};

export function QuantityStepper({ value, onChange, min = 1, variant = "large", label }) {
  const styles = variants[variant];

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`Decrease ${label} quantity`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={`flex items-center justify-center transition-colors disabled:cursor-not-allowed ${styles.button}`}
      >
        <Minus className="size-4" />
      </button>
      <span className={`text-center font-semibold ${styles.value}`}>{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label} quantity`}
        onClick={() => onChange(value + 1)}
        className={`flex items-center justify-center transition-colors ${styles.button}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
