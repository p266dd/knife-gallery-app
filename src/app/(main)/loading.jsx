"use client";

import Image from "next/image";
import { motion } from "motion/react";

import BrandIcon from "@/assets/brand-icon.png";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      className="relative h-full z-50 bg-slate-100 flex items-center justify-center flex-col gap-5"
    >
      <div className="relative w-20">
        <Image src={BrandIcon} alt="Ironclad Logo" priority={true} />
      </div>
      <span className="text-sm text-slate-400 animate-pulse"></span>
    </motion.div>
  );
}
