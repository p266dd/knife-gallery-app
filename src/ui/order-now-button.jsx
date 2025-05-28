"use client";

import { useState } from "react";
import { Loader, ShoppingBag } from "lucide-react";

export default function OrderNowButton({ processOrder, hasError }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        processOrder().then(() => setLoading(false));
      }}
      disabled={loading || hasError}
      className="relative flex items-center justify-center gap-3 w-full px-4 py-2 bg-slate-800 text-white font-bold rounded-xl disabled:bg-slate-300 disabled:text-slate-400"
    >
      {hasError && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-full text-xs text-red-400">
          There is something needing your attention.
        </span>
      )}
      <ShoppingBag size={18} />
      <span>Order Now</span>
      {loading && <Loader size={18} className="animate-spin" />}
    </button>
  );
}
