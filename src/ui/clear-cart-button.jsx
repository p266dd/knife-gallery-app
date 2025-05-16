"use client";

import { clearCart } from "@/actions/remove-cart";

export default function ClearCartButton() {
  return (
    <button
      onClick={() => clearCart()}
      className="w-full px-4 py-2 bg-slate-200 text-slate-600 text-center text-sm rounded-xl"
    >
      <span>Clear Cart</span>
    </button>
  );
}
