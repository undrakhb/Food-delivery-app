"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { fetchFoods } from "@/app/_api/api";
import { CloseButton, ModalTitle, Sheet } from "../_components/modal";
import { LoginRequiredDialog } from "../_components/login-required-dialog";
import { OrderSuccessDialog } from "../_components/order-success-dialog";
import { CartTab } from "./cart-tab";
import { OrdersTab } from "./orders-tab";

const tabs = [
  { id: "cart", label: "Cart" },
  { id: "orders", label: "Order" },
];

export function CartSheet({ open, onOpenChange }) {
  const router = useRouter();
  const [tab, setTab] = useState("cart");
  const [foods, setFoods] = useState(null);
  const [foodsError, setFoodsError] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // Reload the menu each time the sheet opens so prices stay current.
  useEffect(() => {
    if (!open) return;
    fetchFoods()
      .then((data) => {
        setFoods(data);
        setFoodsError(false);
      })
      .catch(() => setFoodsError(true));
  }, [open]);

  function handleOrderPlaced() {
    setSuccessOpen(true);
  }

  function handleBackHome() {
    setSuccessOpen(false);
    onOpenChange(false);
    router.push("/");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center justify-between gap-4">
        <ModalTitle className="flex items-center gap-3 text-xl font-semibold text-white">
          <ShoppingCart className="size-6" />
          Order detail
        </ModalTitle>
        <CloseButton variant="dark" />
      </div>

      <div role="tablist" className="flex shrink-0 rounded-full bg-white p-1">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`h-9 flex-1 rounded-full text-lg transition-colors ${
              tab === id ? "bg-red-500 text-white" : "text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "cart" ? (
        <CartTab
          foods={foods}
          foodsError={foodsError}
          onNeedLogin={() => setLoginOpen(true)}
          onOrderPlaced={handleOrderPlaced}
        />
      ) : (
        <OrdersTab />
      )}

      {/* Rendered inside the sheet so they count as nested dialogs and
          clicking them doesn't close the sheet. */}
      <LoginRequiredDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <OrderSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        onBackHome={handleBackHome}
      />
    </Sheet>
  );
}
