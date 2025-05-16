"use client";

import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import { motion, AnimatePresence } from "motion/react";
import { CircleFadingPlus } from "lucide-react";

import ProductModal from "./product-modal";
import { fetchProductsInfinite } from "@/actions/fetch-products-infinite";

import ProductsGridLoading from "./products-grid-loading";

export default function ProductsGrid({ filter }) {
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

  // * Is there more data to be returned?
  const hasMoreData = data && data[data.length - 1]?.length > 0;

  // * Concatenate data from all pages.
  const allProducts = data ? [].concat(...data) : [];

  return (
    <AnimatePresence>
      <div className="px-2 grid grid-cols-3 gap-1">
        {isLoading ? (
          <ProductsGridLoading />
        ) : (
          allProducts &&
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
                    placeholder="blur"
                    blurDataURL="/img/product-image-placeholder-blur.webp"
                    width={1080}
                    height={1080}
                    alt="Placeholder"
                    className="w-full h-full min-h-[200px] object-cover"
                  />
                </ProductModal>
              </motion.div>
            );
          })
        )}
      </div>
      {hasMoreData && !isLoading && (
        <div key="laodMore" className="flex items-center justify-center mt-6">
          <button
            className="flex items-center gap-4 text-slate-400"
            onClick={() => setSize(size + 1)}
            disabled={isLoading}
          >
            Load More <CircleFadingPlus size={18} />
          </button>
        </div>
      )}
    </AnimatePresence>
  );
}
