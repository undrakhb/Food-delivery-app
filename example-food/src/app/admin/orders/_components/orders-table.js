"use client";

import { ChevronDown, ChevronUp, ChevronsUpDown, MapPin } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/format";
import { FoodItemsPopover } from "./food-items-popover";
import { StatusSelect } from "./status-select";

const COLUMN_COUNT = 8;
const cellClass = "px-4 py-3";
const checkboxClass = "size-4 cursor-pointer align-middle accent-zinc-900";

// sort: "-date" | "date" | "-status" | "status"
function SortHeader({ field, sort, onSort, children }) {
  const direction =
    sort === `-${field}` ? "descending" : sort === field ? "ascending" : "none";
  const Icon =
    direction === "descending"
      ? ChevronDown
      : direction === "ascending"
        ? ChevronUp
        : ChevronsUpDown;

  return (
    <th aria-sort={direction} className={`${cellClass} font-normal`}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`flex w-full items-center justify-between gap-2 transition-colors hover:text-zinc-900 ${
          direction === "none" ? "" : "text-zinc-900"
        }`}
      >
        {children}
        <Icon className="size-4" />
      </button>
    </th>
  );
}

function DeliveryAddress({ order }) {
  const { lat, lng } = order.deliveryLocation ?? {};
  const text = <span className="line-clamp-2">{order.deliveryAddress}</span>;

  if (lat == null || lng == null) {
    return (
      <p title={order.deliveryAddress} className="text-xs text-zinc-500">
        {text}
      </p>
    );
  }

  return (
    <a
      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`}
      target="_blank"
      rel="noreferrer"
      title={`${order.deliveryAddress} (open on map)`}
      className="flex items-start gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-900 hover:underline"
    >
      <MapPin className="mt-px size-3.5 shrink-0 text-red-500" />
      {text}
    </a>
  );
}

function MessageRow({ children }) {
  return (
    <tr className="border-t border-zinc-200">
      <td colSpan={COLUMN_COUNT} className="px-4 py-16 text-center text-zinc-500">
        {children}
      </td>
    </tr>
  );
}

function SkeletonRows() {
  return Array.from({ length: 6 }, (_, i) => (
    <tr key={i} className="border-t border-zinc-200">
      <td colSpan={COLUMN_COUNT} className={cellClass}>
        <div className="h-8 animate-pulse rounded-md bg-zinc-100" />
      </td>
    </tr>
  ));
}

export function OrdersTable({
  orders,
  offset,
  loading,
  error,
  emptyMessage,
  selectedIds,
  onToggle,
  onToggleAll,
  sort,
  onSort,
  foodImages,
  onStatusChange,
}) {
  const selectedOnPage = orders.filter((order) => selectedIds.has(order._id));
  const allSelected = orders.length > 0 && selectedOnPage.length === orders.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  let body;
  if (error) {
    body = <MessageRow>Couldn&apos;t load orders. Please try again later.</MessageRow>;
  } else if (!orders.length && loading) {
    body = <SkeletonRows />;
  } else if (!orders.length) {
    body = <MessageRow>{emptyMessage}</MessageRow>;
  } else {
    body = orders.map((order, index) => {
      const selected = selectedIds.has(order._id);
      const number = offset + index + 1;

      return (
        <tr
          key={order._id}
          className={`border-t border-zinc-200 transition-colors ${
            selected ? "bg-zinc-100" : "hover:bg-zinc-50"
          }`}
        >
          <td className={cellClass}>
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggle(order._id)}
              aria-label={`Select order ${number}`}
              className={checkboxClass}
            />
          </td>
          <td className={cellClass}>{number}</td>
          <td className={`${cellClass} max-w-52 truncate text-zinc-500`}>
            {order.user?.email ?? "Deleted user"}
          </td>
          <td className={cellClass}>
            <FoodItemsPopover items={order.foodOrderItems} images={foodImages} />
          </td>
          <td className={`${cellClass} whitespace-nowrap text-zinc-500`}>
            {formatDate(order.created_at)}
          </td>
          <td className={`${cellClass} text-zinc-500`}>
            {formatPrice(order.totalPrice)}
          </td>
          <td className={`${cellClass} w-56 max-w-56`}>
            <DeliveryAddress order={order} />
          </td>
          <td className={cellClass}>
            <StatusSelect
              value={order.status}
              onChange={(status) => onStatusChange(order._id, status)}
            />
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="overflow-x-auto">
      <table
        aria-busy={loading}
        className={`w-full text-left text-sm transition-opacity ${
          loading && orders.length ? "opacity-60" : ""
        }`}
      >
        <thead className="bg-zinc-50 text-zinc-500">
          <tr className="border-t border-zinc-200">
            <th className={`${cellClass} w-12`}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={(e) => onToggleAll(e.target.checked)}
                disabled={!orders.length}
                aria-label="Select all orders on this page"
                className={checkboxClass}
              />
            </th>
            <th className={`${cellClass} w-12 font-normal text-zinc-900`}>№</th>
            <th className={`${cellClass} font-normal`}>Customer</th>
            <th className={`${cellClass} font-normal`}>Food</th>
            <SortHeader field="date" sort={sort} onSort={onSort}>
              Date
            </SortHeader>
            <th className={`${cellClass} font-normal`}>Total</th>
            <th className={`${cellClass} font-normal`}>Delivery Address</th>
            <SortHeader field="status" sort={sort} onSort={onSort}>
              Delivery state
            </SortHeader>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
