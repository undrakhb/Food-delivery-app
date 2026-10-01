import { ChefHat } from "lucide-react";

export function Logo({ stacked = false }) {
  return (
    <div
      className={`flex items-center gap-3 ${stacked ? "flex-col text-center" : ""}`}
    >
      <ChefHat className="size-9 text-red-500" />
      <div>
        <p className="text-xl leading-7 font-semibold text-white">
          Nom<span className="text-red-500">Nom</span>
        </p>
        <p className="text-xs text-zinc-400">Swift delivery</p>
      </div>
    </div>
  );
}
