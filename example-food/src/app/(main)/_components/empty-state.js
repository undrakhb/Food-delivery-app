import { ChefHat } from "lucide-react";

export function EmptyState({ title, children }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-zinc-100 px-12 py-8 text-center">
      <ChefHat className="mb-3 size-12 text-red-500" />
      <p className="font-bold text-zinc-900">{title}</p>
      <p className="text-xs text-zinc-500">{children}</p>
    </div>
  );
}
