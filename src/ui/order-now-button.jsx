"use client";

import { ShoppingBag } from "lucide-react";

export default function OrderNowButton({ processOrder }) {
  return (
    <button
      onClick={() => processOrder()}
      className="flex items-center justify-center gap-3 w-full px-4 py-2 bg-slate-800 text-white font-bold rounded-xl"
    >
      <ShoppingBag size={18} />
      <span>Order Now</span>
    </button>
  );
}
