"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { CircleFadingPlus } from "lucide-react";
import useSWRInfinite from "swr/infinite";

import ProductModal from "@/ui/product-modal";
import searchProducts from "@/actions/search-products";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create an object to hold the structured parameters.
  const searchObject = {};

  // Iterate over all keys.
  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key);
    // If there's more than one value, store it as an array, otherwise store the single value.
    searchObject[key] = values.length > 1 ? values : values[0];
  }

  // * Get the pageIndex and filter.
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;
    return {
      pageIndex,
      searchObject,
    };
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    searchProducts,
    {
      revalidateOnFocus: false,
    }
  );

  // * Is there more data to be returned?
  const hasMoreData = data && data[data.length - 1]?.length > 0;

  // * Concatenate data from all pages.
  const allProducts = data ? [].concat(...data) : [];

  console.log(allProducts);

  return (
    <AnimatePresence>
      <div className="px-2 grid grid-cols-3 gap-1">
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
                    className="w-full h-full min-h-[200px] object-cover"
                  />
                </ProductModal>
              </motion.div>
            );
          })}
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
