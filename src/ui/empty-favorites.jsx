"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

export default function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 mx-4 py-20 px-12 text-slate-500 rounded-xl">
      <motion.div
        animate={{
          rotate: 360,
          transition: { type: "spring", duration: 2 },
        }}
      >
        <Star size={100} strokeWidth={0.5} />
      </motion.div>

      <h5 className="text-xs text-center sm:text-base">
        You don't have any favorites, yet.
      </h5>
      <h4 className="text-base text-center sm:text-xl">
        Let's get started by adding some!
      </h4>
    </div>
  );
}
