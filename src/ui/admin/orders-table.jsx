"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Search,
  PrinterIcon,
  BadgeInfo,
} from "lucide-react";

import Button from "@/ui/button";

import { fetchOrders } from "@/actions/fetch-orders";
import LinkLoading from "../link-loading";

export default function DashboardOrdersTable({ newOnly = false }) {
  // * User's search input content.
  const [searchQuery, setSearchQuery] = useState(null);

  // * Search input reference.
  const inputRef = useRef(null);

  // * Pagination settings.
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const { data, error, isLoading } = useSWR(
    { searchQuery, page, itemsPerPage, newOnly },
    (config) => fetchOrders(config)
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
    setPage(1);
  };

  if (data && data?.data.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <BadgeInfo size={16} strokeWidth={1.5} />
        <h4 className="text font-thin text-slate-600">
          There are no orders to display.
        </h4>
      </div>
    );
  }

  return (
    <div>
      {!newOnly && (
        <div className="my-4 pr-2">
          <div className="pl-2 py-[2px] pr-1 flex items-center gap-3 bg-white border border-slate-300 rounded-xl">
            <input
              type="text"
              ref={inputRef}
              placeholder="What are you looking for?"
              className="flex-grow py-1 text-sm focus-visible:outline-0"
            />
            <button
              onClick={handleSearch}
              className="w-20 flex items-center gap-2 py-1 px-2 bg-slate-800 text-slate-300 text-xs rounded-md"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pr-2 mr-2">Date</th>
            <th className="px-2 mr-2">Client</th>
            <th className="px-2 mr-2">Code</th>
            <th className="pl-2">{/* Used for action buttons. */}</th>
          </tr>
        </thead>
        <tbody className="text-sm border border-slate-300">
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

          {data &&
            data.data &&
            data.data.map((order, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="pr-2 mr-2 py-2 pl-1">
                  <div className="text-xs">
                    {new Date(order.createdAt)
                      .toISOString()
                      .split("T")[0]
                      .replaceAll("-", "/")
                      .substring(2, 7)}
                  </div>
                </td>
                <td className="px-2 mr-2 py-2">
                  <Link href={"/dashboard/orders/" + order.id}>
                    <div className="max-w-28 overflow-hidden overflow-ellipsis">
                      {order.client.businessName}
                    </div>
                  </Link>
                </td>
                <td className="px-2 mr-2 py-2">
                  <Link href={"/dashboard/orders/" + order.id}>
                    <div>{order.code.split("-")[(0, 1)]}</div>
                  </Link>
                </td>
                <td className="pl-2 pr-1 py-2">
                  <div>
                    <Link
                      href={"/dashboard/orders/" + order.id + "/print"}
                      className={`flex items-center gap-2 text-xs text-slate-700`}
                    >
                      <PrinterIcon
                        size={14}
                        strokeWidth={1}
                        className="inline-block"
                      />
                      <LinkLoading />
                      <span className="hidden sm:block">Print</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between my-4">
          <div>
            Page {data.currentPage} of {data.totalPages}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              size="sm"
              onClick={previousPage}
              disabled={page === 1}
            >
              <ArrowLeftCircle size={14} className="inline-block mr-2" />
              Previous
            </Button>
            <Button
              variant="flat"
              size="sm"
              onClick={nextPage}
              disabled={page === data.totalPages}
            >
              Next
              <ArrowRightCircle size={14} className="inline-block ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
