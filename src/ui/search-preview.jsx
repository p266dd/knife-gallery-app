"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";

import { searchProduct } from "@/actions/search-products";

export default function SearchPreview({ data, setData, currentTerm = null }) {
  const [showPreview, setShowPreview] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchTermRef = useRef(null);
  const resultsTableRef = useRef(null);

  const response = useSWR(searchValue, async (searchValue) => {
    const results = await searchProduct(searchValue);
    setShowPreview(true);
    return results;
  });

  const handleInput = (e) => {
    setData({ ...data, searchTerm: e.target.value });
    if (e.target.value.length > 3) setSearchValue(e.target.value);
    if (e.target.value.length < 3) setShowPreview(false);
  };

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target !== resultsTableRef.current) {
        setShowPreview(false);
      }

      document.removeEventListener("click", this);
    });
  }, [showPreview]);

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
          value={
            (data && data?.searchTerm) || (currentTerm && currentTerm) || ""
          }
          onChange={handleInput}
        />
        <AnimatePresence>
          {data && data?.searchTerm && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-1/2 -translate-y-1/2 right-3"
              onClick={() => {
                searchTermRef.current.value = "";
                setShowPreview(false);
                setData({ ...data, searchTerm: "" });
              }}
            >
              <X size={20} className="stroke-slate-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-0 z-50 w-full max-h-80 overflow-y-auto overflow-x-hidden px-2 py-3 flex flex-col gap-3 bg-white rounded-xl shadow-md"
          >
            {response.data && response.data.length > 0 ? (
              response.data.map((product, i) => (
                <Link
                  key={`productPreview-${i}`}
                  href={`/products/${product.id}`}
                >
                  <div className="flex items-center gap-2 px-1 border-b border-slate-200 last:border-b-0">
                    <div className="relative w-3/12 h-24">
                      <Image
                        src={
                          product.thumbnail.url ||
                          "/img/product-image-placeholder.webp"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg overflow-hidden"
                        fill
                      />
                    </div>
                    <div className="w-9/12">
                      <h4>{product.name}</h4>
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-slate-500">
                          <strong>Handle: </strong>
                          {product.handle}
                        </span>
                        <span className="text-xs text-slate-500">
                          <strong>Material: </strong>
                          {product.material}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-6 px-9 text-base text-slate-600">
                No results found.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
