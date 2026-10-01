"use client";

import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  fetchFoods,
  getErrorMessage,
  updateOrdersStatus,
} from "@/app/_api/api";
import { OrdersTable } from "./_components/orders-table";
import { Pagination } from "./_components/pagination";
import { ChangeStateDialog } from "./_features/change-state-dialog";
import { DateRangePicker } from "./_features/date-range-picker";

// The calendar gives local midnights, so the last day runs to its very end.
const endOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("-date");
  const [range, setRange] = useState();
  // Bumped after a status change to load the page again.
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [foodImages, setFoodImages] = useState(() => new Map());

  const lastDay = range?.to ?? range?.from;
  const queryKey = JSON.stringify({
    page,
    sort,
    from: range?.from?.toISOString(),
    to: lastDay ? endOfDay(lastDay).toISOString() : undefined,
    version,
  });

  useEffect(() => {
    let ignore = false;
    fetchAllOrders(JSON.parse(queryKey))
      .then((data) => {
        if (!ignore) setResult({ key: queryKey, data });
      })
      .catch(() => {
        if (!ignore) setResult({ key: queryKey, error: true });
      });
    return () => {
      ignore = true;
    };
  }, [queryKey]);

  // Food images for the order popovers. Without them the list still works.
  useEffect(() => {
    fetchFoods()
      .then((foods) => setFoodImages(new Map(foods.map((food) => [food._id, food.image]))))
      .catch(() => {});
  }, []);

  // The previous page stays on screen, dimmed, while the next one loads.
  const loading = result?.key !== queryKey;
  const data = result?.data;
  const orders = data?.foodOrders ?? [];
  const pageCount = data ? Math.ceil(data.total / data.pageSize) : 0;

  function resetSelection() {
    setSelectedIds(new Set());
  }

  function changePage(next) {
    setPage(next);
    resetSelection();
  }

  // The first click on a column shows newest (or pending) first.
  function changeSort(field) {
    setSort((current) => (current === `-${field}` ? field : `-${field}`));
    setPage(1);
    resetSelection();
  }

  function changeRange(next) {
    setRange(next);
    setPage(1);
    resetSelection();
  }

  function toggle(id) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll(checked) {
    setSelectedIds(checked ? new Set(orders.map((order) => order._id)) : new Set());
  }

  async function changeStatus(ids, status) {
    try {
      await updateOrdersStatus(ids, status);
      setVersion((current) => current + 1);
      return true;
    } catch (error) {
      alert(getErrorMessage(error, "Couldn't change the delivery state."));
      return false;
    }
  }

  async function changeSelectedStatus(status) {
    const saved = await changeStatus([...selectedIds], status);
    if (saved) resetSelection();
    return saved;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Orders</h1>
            <p className="h-4 text-xs text-zinc-500">
              {data ? `${data.total} ${data.total === 1 ? "item" : "items"}` : null}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DateRangePicker value={range} onChange={changeRange} />
            <ChangeStateDialog
              count={selectedIds.size}
              onSave={changeSelectedStatus}
            />
          </div>
        </div>

        <OrdersTable
          orders={orders}
          offset={data ? (data.page - 1) * data.pageSize : 0}
          loading={loading}
          error={!loading && result?.error}
          emptyMessage={range ? "No orders in these dates." : "No orders yet."}
          selectedIds={selectedIds}
          onToggle={toggle}
          onToggleAll={toggleAll}
          sort={sort}
          onSort={changeSort}
          foodImages={foodImages}
          onStatusChange={(id, status) => changeStatus([id], status)}
        />
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={changePage} />
    </div>
  );
}
