"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { CircleX } from "lucide-react";

export default function FilterTag({ filter, active }) {
  const router = useRouter();
  const isActive = filter.name.toLowerCase() === active;

  return (
    <motion.span
      whileTap={{ scale: 0.9 }}
      onClick={() =>
        isActive
          ? router.push("/")
          : router.push("/?filter=" + filter.name.toLowerCase())
      }
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
