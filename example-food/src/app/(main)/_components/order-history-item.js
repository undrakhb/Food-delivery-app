import { Clock, MapPin, Soup } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/format";

const statuses = {
  PENDING: { label: "Pending", className: "border-red-500 text-zinc-900" },
  DELIVERED: { label: "Delivered", className: "border-zinc-200 text-zinc-900" },
  CANCELED: { label: "Canceled", className: "border-zinc-200 text-zinc-400" },
};

export function OrderHistoryItem({ order }) {
  const status = statuses[order.status] ?? statuses.PENDING;

  return (
    <li className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold">
          {formatPrice(order.totalPrice)}{" "}
          <span className="font-normal text-zinc-500">
            (#{order._id.slice(-5).toUpperCase()})
          </span>
        </p>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <ul className="flex flex-col gap-2 text-xs text-zinc-500">
        {order.foodOrderItems.map((item) => (
          <li key={item._id} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              <Soup className="size-4 shrink-0" />
              <span className="truncate">{item.food?.name ?? "Removed dish"}</span>
            </span>
            <span className="shrink-0 text-zinc-900">x {item.quantity}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 text-xs text-zinc-500">
        <p className="flex items-center gap-2">
          <Clock className="size-4 shrink-0" />
          {formatDate(order.created_at)}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{order.deliveryAddress}</span>
        </p>
      </div>
    </li>
  );
}
