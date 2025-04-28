"use client";

import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import { motion, AnimatePresence } from "motion/react";

import ProductModal from "./product-modal";
import { fetchProductsInfinite } from "@/actions/fetch-products-infinite";
import { useStore } from "@/utils/store";

export default function ProductsGrid() {
  // * Only one filter at a time.
  const filter = useStore((state) => state.filter);

  // * Get the pageIndex and filter.
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;
    return {
      pageIndex,
      filter,
    };
  };

  // * Fetch paginated products.
  const { data, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    fetchProductsInfinite
  );

  // * Concatenate data from all pages.
  const allProducts = data ? [].concat(...data) : [];

  return (
    <div className="px-2 grid grid-cols-3 gap-1">
      <AnimatePresence>
        {allProducts &&
          allProducts.map((product, i) => {
            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative bg-slate-100"
              >
                <ProductModal product={product}>
                  <Image
                    src={product.thumbnail.url || "/product-image.webp"}
                    width={1080}
                    height={1080}
                    alt="Placeholder"
                    className="w-full h-full object-cover"
                  />
                </ProductModal>
              </motion.div>
            );
          })}
      </AnimatePresence>
      {/* 180 from bottom */}
      <button onClick={() => setSize(size + 1)} disabled={isLoading}>
        Load More
      </button>
    </div>
  );
}
