"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMyOrders } from "@/app/_api/api";
import { useAuth } from "@/providers/auth-provider";
import { EmptyState } from "../_components/empty-state";
import { OrderHistoryItem } from "../_components/order-history-item";
import { SheetCard } from "../_components/sheet-card";

export function OrdersTab() {
  const { user } = useAuth();
  const userId = user?._id;
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(false);

  // Fetched each time the tab is shown, so statuses stay current.
  useEffect(() => {
    if (!userId) return;
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setError(true));
  }, [userId]);

  let content;
  if (!userId) {
    content = (
      <>
        <EmptyState title="Log in to see your orders">
          Your order history will show up here once you log in.
        </EmptyState>
        <Link
          href="/login"
          className="flex h-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Log in
        </Link>
      </>
    );
  } else if (error) {
    content = (
      <p className="py-8 text-center text-sm text-zinc-500">
        Couldn&apos;t load your orders. Please try again later.
      </p>
    );
  } else if (!orders) {
    content = (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-neutral-200" />
        ))}
      </div>
    );
  } else if (orders.length === 0) {
    content = (
      <EmptyState title="No orders yet">
        🍕 You haven&apos;t placed any orders yet. Start exploring our menu and
        satisfy your cravings!
      </EmptyState>
    );
  } else {
    content = (
      <ul className="divide-y divide-dashed divide-zinc-300">
        {orders.map((order) => (
          <OrderHistoryItem key={order._id} order={order} />
        ))}
      </ul>
    );
  }

  return (
    <SheetCard title="Order history" className="flex-1">
      {content}
    </SheetCard>
  );
}
