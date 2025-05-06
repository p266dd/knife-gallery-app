"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import Link from "next/link";

export default function SearchPreview({ data, setData }) {
  const [showPreview, setShowPreview] = useState(false);
  const searchTermRef = useRef(null);

  const handleInput = (e) => {
    setData({ ...data, searchTerm: e.target.value });
    if (e.target.value.length > 3) setShowPreview(true);
    if (e.target.value.length < 3) setShowPreview(false);
  };

  return (
    <div className="relative">
      <div className="relative flex items-center bg-white border border-slate-300 rounded-xl">
        <div className="absolute top-1/2 -translate-y-1/2 left-3">
          <Search size={20} className="stroke-slate-700" />
        </div>
        <input
          ref={searchTermRef}
          type="text"
          name="searchTerm"
          placeholder="Search for a product."
          className="w-full pl-10 pr-3 pt-3 pb-2 focus-visible:outline-0"
          value={(data && data?.searchTerm) || ""}
          onChange={handleInput}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 right-3"
          onClick={() => {
            searchTermRef.current.value = "";
            setShowPreview(false);
            setData({ ...data, searchTerm: "" });
          }}
        >
          <X size={20} className="stroke-slate-700" />
        </div>
      </div>
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-0 w-full px-2 py-3 flex flex-col gap-3 bg-white rounded-xl shadow-md"
          >
            <Link href="/products/cma41k9zb0002ijcslbl5ah9c">
              <div className="flex items-center gap-2 px-1 border-b border-slate-200 last:border-b-0">
                <div className="relative w-3/12 h-24">
                  <Image
                    src="/img/product-image-placeholder.webp"
                    alt="Placeholder"
                    className="w-full h-full object-cover rounded-lg overflow-hidden"
                    fill
                  />
                </div>
                <div className="w-9/12">
                  <h4>Uchigumo / SPG2 Powder Metal Damascus</h4>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-500">
                      <strong>Handle:</strong> <br />
                      Rosewood Octagon
                    </span>
                    <span className="text-xs text-slate-500">
                      <strong>Material:</strong> <br />
                      Powder Metal Damascus
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
