"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import { PrinterIcon } from "lucide-react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

import Button from "@/ui/button";
import { fetchOrders } from "@/actions/fetch-orders";

export default function DashboardOrdersTable({ onlyNew = false, perPage }) {
  // * User's search input content.
  const [searchQuery, setSearchQuery] = useState("all");

  // * Pagination settings.
  const [page, setPage] = useState(1);
  const itemsPerPage = perPage || 10;

  const { data, error, isLoading } = useSWR(
    searchQuery
      ? { searchQuery, page, itemsPerPage, onlyNew }
      : { searchQuery: "all", page, itemsPerPage, onlyNew },
    (config) => fetchOrders(config)
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

  const handleSearch = (event) => {
    const inputContent = event.target.value;

    // * Reset searchQuery if user clear value.
    if (inputContent.length === 0) setSearchQuery("");

    // * Searches if length of value is 3 or more.
    if (inputContent.length >= 3) setSearchQuery(inputContent);

    // * Always reset page when searchQuery chnages.
    setPage(1);
  };

  return (
    <div>
      {!onlyNew && <div className="my-4">Filter and search</div>}
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pr-2 mr-2">Date</th>
            <th className="px-2 mr-2">Client</th>
            <th className="px-2 mr-2">Code</th>
            <th className="pl-2">{/* Used for action buttons. */}</th>
          </tr>
        </thead>
        <tbody className="text-sm">
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
              <tr key={i}>
                <td className="pr-2 mr-2 py-1">
                  <div>02/30</div>
                </td>
                <td className="px-2 mr-2 py-1">
                  <Link href="#">
                    <div className="max-w-28 overflow-hidden overflow-ellipsis">
                      Knotty
                    </div>
                  </Link>
                </td>
                <td className="px-2 mr-2 py-1">
                  <Link href="#">
                    <div>#883674</div>
                  </Link>
                </td>
                <td className="pl-2 py-1">
                  <div>
                    <button
                      className={`flex items-center gap-2 px-3 py-1 text-xs ${onlyNew ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"}  rounded-xl`}
                    >
                      <PrinterIcon
                        size={14}
                        strokeWidth={1}
                        className="inline-block"
                      />
                      <span className="hidden sm:block">Print</span>
                    </button>
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
            <Button size="sm" onClick={previousPage} disabled={page === 1}>
              <ArrowLeftCircle size={14} className="inline-block mr-2" />
              Previous
            </Button>
            <Button
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
