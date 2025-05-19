"use client";

import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 mx-4 py-24 px-12 text-slate-500 rounded-xl">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { type: "spring", duration: 0.5 },
        }}
      >
        <ShoppingBag size={100} strokeWidth={0.5} />
      </motion.div>

      <h5 className="text-xs text-center sm:text-base">
        There's nothing in your cart.
      </h5>
      <h4 className="text-base text-center sm:text-xl">
        Why don't you add some!
      </h4>
    </div>
  );
}
