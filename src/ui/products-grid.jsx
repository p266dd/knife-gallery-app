"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { motion, AnimatePresence } from "motion/react";
// import { CircleFadingPlus } from "lucide-react";

import ProductModal from "./product-modal";
import { fetchProductsInfinite } from "@/actions/fetch-products-infinite";

import ProductsGridLoading from "./products-grid-loading";
import { Loader } from "lucide-react";

export default function ProductsGrid({ filter }) {
  const observerRef = useRef(null);

  // * Get the pageIndex and filter.
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;
    return {
      pageIndex,
      filter,
    };
  };

  // * Fetch paginated products.
  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    fetchProductsInfinite
  );

  // * Is there more data to be returned?
  const hasMoreData = data && data[data.length - 1]?.length > 0;

  // * Concatenate data from all pages.
  const allProducts = data ? [].concat(...data) : [];

  // * Callback for IntersectionObserver
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMoreData && !isLoading) {
        setSize((prevSize) => prevSize + 9);
      }
    },
    [setSize, hasMoreData, isLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.1, // 10% of the target is visible
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, [handleObserver]);

  return (
    <AnimatePresence key="grid">
      <div className="px-2 grid grid-cols-3 gap-1 sm:grid-cols-4">
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
                    className="w-full h-full min-h-[200px] object-cover select-none"
                  />
                </ProductModal>
              </motion.div>
            );
          })
        )}
      </div>
      {isValidating && (
        <div
          key="loadMore"
          className="flex items-center justify-center mt-6 sm:mt-12"
        >
          <button
            className="flex items-center gap-4 text-slate-400 sm:text-xl"
            onClick={() => setSize(size + 1)}
            disabled={isLoading}
          >
            Loading <Loader size={18} className="animate-spin" />
          </button>
        </div>
      )}

      {/* Element for IntersectionObserver */}
      {hasMoreData && !isLoading && (
        <div key="observer" ref={observerRef} style={{ height: "1px" }} />
      )}
    </AnimatePresence>
  );
}
