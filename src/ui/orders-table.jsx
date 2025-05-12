"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import Link from "next/link";

import { fetchOrdersClient } from "@/actions/fetch-orders";
import { ChevronLeftCircle, ChevronRightCircle, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function OrdersTable() {
  const [showSearch, setShowSearch] = useState(false);
  const [perPage, setPerPage] = useState(8);

  // * User's search input content.
  const [searchQuery, setSearchQuery] = useState(null);

  // * Search input reference.
  const inputRef = useRef(null);

  // * Pagination settings.
  const [page, setPage] = useState(1);
  const itemsPerPage = perPage;

  const { data, error, isLoading } = useSWR(
    { searchQuery, page, itemsPerPage, table: "orders" },
    (config) => fetchOrdersClient(config)
  );

  const previousPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

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

  // * helper function to calculate the total ordered items
  const totalOrdered = (products) => {
    let total = 0;
    products.forEach((product) => {
      product.details.forEach((detail) => {
        total += Number(detail.quantity);
      });
    });
    return total;
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>{data && data.totalCount} orders.</div>

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
                    placeholder="Search by date or code."
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
          <thead className="text-sm">
            <tr>
              <th className="w-3/12">Order #</th>
              <th className="w-3/12">Date</th>
              <th className="w-2/12">Qty.</th>
              <th className="w-4/12">Ordered by</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading && (
              <tr>
                <td colSpan={4}>Loading data...</td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={4}>Error loading data.</td>
              </tr>
            )}

            {data?.data &&
              data.data.map((order, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 last:border-b-transparent text-slate-700"
                >
                  <td className="py-2 w-3/12">
                    <span className="text-sm">
                      <Link href={"/orders/" + order.id}>{order.id}</Link>
                    </span>
                  </td>
                  <td className="py-2 w-3/12">
                    <span className="text-sm">
                      <Link href={"/orders/" + order.id}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Link>
                    </span>
                  </td>
                  <td className="py-2 w-2/12">
                    <span className="text-sm">
                      <Link href={"/orders/" + order.id}>
                        {totalOrdered(
                          JSON.parse(
                            order?.orderProduct ? order.orderProduct : "[]"
                          )
                        )}
                      </Link>
                    </span>
                  </td>
                  <td className="py-2 w-4/12">
                    <span className="text-sm">
                      <Link href={"/orders/" + order.id}>
                        {order.client.name}
                      </Link>
                    </span>
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
