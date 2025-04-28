"use client";

import { motion } from "motion/react";
import { Flame, CircleX } from "lucide-react";

import { useStore } from "@/utils/store";

export default function FilterTag({ filter }) {
  // * Parameter filter has name and id only

  const storeFilter = useStore((state) => state.filter);
  const addFilter = useStore((state) => state.addFilter);
  const removeFilter = useStore((state) => state.removeFilter);

  const isActive = storeFilter === filter.name;

  const handleClick = () =>
    isActive ? removeFilter(filter.name) : addFilter(filter.name);

  return (
    <motion.span
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`
        cursor-pointer flex felx-row gap-2 items-center
        px-4 py-2 text-sm rounded-xl border border-transparent
        ${
          isActive
            ? "text-white bg-slate-800 hover:bg-slate-700"
            : "text-slate-700 bg-slate-200 border-slate-300"
        }`}
    >
      {filter.name}
      {isActive ? <CircleX size={14} /> : null}
    </motion.span>
  );
}
