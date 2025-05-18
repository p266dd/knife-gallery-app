"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";
import {
  Filter,
  Search,
  ChevronLeftCircle,
  ChevronRightCircle,
} from "lucide-react";

import { fetchProducts } from "@/actions/fetch-products";
import LinkLoading from "../link-loading";

export default function ProductsTable({ filters }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [perPage, setPerPage] = useState(10);

  // * User's search input content.
  const [searchQuery, setSearchQuery] = useState(null);

  // * Filter type.
  const [filterType, setFilterType] = useState(null);

  // * Search input reference.
  const inputRef = useRef(null);

  // * Pagination settings.
  const [page, setPage] = useState(1);
  const itemsPerPage = perPage || 10;

  const { data, error, isLoading } = useSWR(
    { searchQuery, filterType, page, itemsPerPage, table: "products" },
    (config) => fetchProducts(config)
  );

  const previousPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  // * Only change page if there is more content to show.
  const nextPage = () => {
    if (data && page < data.totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // * Set the searchQuery state and set page to 1.
  const handleSearch = () => {
    const inputContent = inputRef.current.value;
    setSearchQuery(inputContent);
    setShowSearch(false);
    setPage(1);
  };

  // * Set the filterType to the select filter name.
  const handleFilterSelect = (e) => {
    // e.preventDefault();
    setFilterType(e.target.value);
    setShowFilter(false);
  };

  return (
    <>
      <div className="flex-grow flex gap-3 mb-4">
        <div className="flex-grow">
          <label htmlFor="showing" className="hidden md:inline-block">
            Showing
          </label>
          <select
            className="focus-visible:outline-0 rounded-xl px-3 py-1 border-r-10 border-transparent"
            name="showing"
            id="showing"
            onChange={(e) => setPerPage(e.target.value)}
            defaultValue="10"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="relative">
          <div
            onClick={() => setShowFilter((prev) => !prev)}
            className={`${showFilter || filterType ? "bg-slate-800 text-white" : "bg-white"} shadow-xs flex items-center gap-3 px-3 py-1 rounded-xl`}
          >
            <Filter size={18} />
            <span>Filter</span>
          </div>
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute top-10 right-1/2 translate-x-1/2 z-50 flex flex-col justify-between gap-2 px-3 py-2 bg-white shadow-lg rounded-xl"
              >
                <button
                  onClick={() => {
                    setFilterType(null);
                    setShowFilter(false);
                  }}
                  className="py-2 text-center text-sm font-semibold bg-slate-200 rounded-xl"
                >
                  Clear
                </button>

                <label
                  htmlFor="knife"
                  className="w-full text-sm flex justify-between items-center gap-3"
                >
                  Knife
                  <input
                    type="radio"
                    id="knife"
                    name="filterType"
                    value="knife"
                    defaultChecked={filterType === "knife"}
                    onChange={handleFilterSelect}
                  />
                </label>

                <label
                  htmlFor="other"
                  className="w-full text-sm flex justify-between items-center gap-3"
                >
                  Other
                  <input
                    type="radio"
                    id="other"
                    name="filterType"
                    value="other"
                    defaultChecked={filterType === "other"}
                    onChange={handleFilterSelect}
                  />
                </label>
                {filters &&
                  filters.map((filter) => {
                    return (
                      <label
                        key={filter + "-filter"}
                        htmlFor={filter.id}
                        className="w-full text-sm flex justify-between items-center gap-3"
                      >
                        {filter.name}
                        <input
                          type="radio"
                          id={filter.id}
                          name="filterType"
                          value={filter.name}
                          defaultChecked={filterType === filter.name}
                          onChange={handleFilterSelect}
                        />
                      </label>
                    );
                  })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div
              onClick={() => setShowSearch((prev) => !prev)}
              className={`${showSearch || searchQuery ? "bg-slate-800 text-white" : "bg-white"} shadow-xs flex items-center gap-3 px-3 py-1 rounded-xl`}
            >
              <Search size={18} />
              <span>Search</span>
            </div>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="absolute top-10 right-0 z-50 flex items-center"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    name="searchQuery"
                    placeholder="Search product by name."
                    autoComplete="off"
                    defaultValue={searchQuery ? searchQuery : ""}
                    className="text-sm px-3 py-3 pr-16 bg-white border border-slate-300 rounded-l-xl shadow-lg focus-visible:outline-0"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearch(false);
                        inputRef.current.value = "";
                      }}
                      className="absolute right-15 top-4 text-xs text-slate-500"
                    >
                      X Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="text-sm px-3 py-3 text-white bg-slate-800 rounded-r-xl shadow-lg"
                  >
                    <Search size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      <div className="py-3 px-2 bg-white drop-shadow-xs rounded-2xl">
        <table className="w-full text-left">
          <thead className="text-sm sm:text-lg">
            <tr>
              <th className="pl-2">Products</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-sm sm:text-lg">
            {isLoading && (
              <tr>
                <td>Loading data...</td>
              </tr>
            )}

            {error && (
              <tr>
                <td>Error loading data.</td>
              </tr>
            )}

            {data?.data &&
              data.data.map((product, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 last:border-b-transparent"
                >
                  <td>
                    <div className="relative w-16 h-28 my-2 rounded-xl overflow-hidden">
                      <Link href={"/dashboard/products/" + product.id}>
                        <Image
                          src={
                            (product?.thumbnail && product?.thumbnail.url) ||
                            "/img/product-image-placeholder.webp"
                          }
                          alt={product.name}
                          fill
                        />
                      </Link>
                    </div>
                  </td>
                  <td className="py-2 px-2 w-10/12 sm:w-11/12 h-14">
                    <div>
                      <Link href={"/dashboard/products/" + product.id}>
                        <h5 className="mb-1 w-full text-ellipsis overflow-hidden capitalize">
                          <LinkLoading /> {product.name}
                        </h5>
                        <div className="flex items-center gap-4">
                          <span className="text-xs sm:text-base text-slate-500 capitalize">
                            <strong className="text-[10px] sm:text-xs font-semibold">
                              Handle:
                            </strong>{" "}
                            <br />
                            {product.handle}
                          </span>
                          <span className="text-xs sm:text-base text-slate-500 capitalize">
                            <strong className="text-[10px] sm:text-xs font-semibold">
                              Material:
                            </strong>{" "}
                            <br />
                            {product.material}
                          </span>
                        </div>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-slate-600 text-xs">
            {data && data?.totalPages} Pages
          </span>
        </div>
        <div className="flex-grow flex items-center justify-end gap-2 text-sm">
          {page && page > 1 && (
            <span
              onClick={previousPage}
              className="px-3 py-2 rounded-full bg-white shadow-xs flex items-center gap-3"
            >
              <ChevronLeftCircle size={18} />
              Previous
            </span>
          )}

          <div className="flex items-center gap-3 px-4">
            {page && page === 1 ? "Page " : ""}
            {page}
          </div>

          {data && page < data.totalPages && (
            <span
              onClick={nextPage}
              className="px-3 py-2 rounded-full bg-white shadow-xs flex items-center gap-3"
            >
              Next
              <ChevronRightCircle size={18} />
            </span>
          )}
        </div>
      </div>
    </>
  );
}
