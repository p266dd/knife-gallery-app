"use client";

import Image from "next/image";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, CircleFadingPlus, Loader } from "lucide-react";
import useSWRInfinite from "swr/infinite";

import ProductModal from "@/ui/product-modal";
import searchProducts from "@/actions/search-products";
import SearchForm from "@/ui/search-form";

import { fetchBrands } from "@/actions/brands";
import { fetchMaterials } from "@/actions/materials";

export default function ResultsPage() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  const brandsObject = useSWR("fetchBrands", fetchBrands, {
    revalidateOnFocus: false,
  });

  const materialObject = useSWR("fetchMaterials", fetchMaterials, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    // * Closes search popup if user modify search.
    setShowFilter(false);
  }, [searchParams]);

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

  if (error) {
    console.log(error);
  }

  // * Is there more data to be returned?
  const hasMoreData = data && data[data.length - 1]?.length > 0;

  // * Concatenate data from all pages.
  const allProducts = data ? [].concat(...data) : [];

  return (
    <main className="pt-16 pb-40">
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilter(false)}
            className="fixed inset-0 bg-black/90 z-40"
          ></motion.div>
        )}
      </AnimatePresence>
      <div className="px-6 mt-9 mb-7">
        <h1 className="text-4xl mb-2">Search Results</h1>
      </div>

      <div className="bg-slate-900 sm:rounded-xl">
        <div className="px-6 py-3">
          <button
            type="button"
            onClick={() => setShowFilter((prev) => !prev)}
            className="w-full flex items-center gap-4 justify-between"
          >
            <span className="text-white">Filter Your Search</span>
            <span>
              <ChevronDown size={20} className="stroke-white" />
            </span>
          </button>
        </div>
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 p-3 z-50 bg-white rounded-xl shadow-2xl"
            >
              <SearchForm
                brands={brandsObject && brandsObject.data}
                materials={materialObject && materialObject.data}
                currentSearch={searchObject}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2">
        <AnimatePresence>
          <div className="px-2 grid grid-cols-3 gap-1 sm:grid-cols-4">
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
          {isLoading && (
            <div
              key="laodMore"
              className="flex items-center justify-center mt-6"
            >
              <Loader size={20} className="stroke-slate-500 animate-spin" />{" "}
              <span className="text-slate-500 ml-4">Loading</span>
            </div>
          )}
          {hasMoreData && !isLoading && (
            <div
              key="laodMore"
              className="flex items-center justify-center mt-6"
            >
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
      </div>
    </main>
  );
}
