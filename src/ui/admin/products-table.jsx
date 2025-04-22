"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import useSWR from "swr";
import {
  Filter,
  Search,
  CheckSquare,
  ChevronLeftCircle,
  ChevronRightCircle,
} from "lucide-react";

import { fetchProducts } from "@/actions/fetch-products";

export default function ProductsTable() {
  const [perPage, setPerPage] = useState(20);

  // * User's search input content.
  const [searchQuery, setSearchQuery] = useState(null);

  // * Search input reference.
  const inputRef = useRef(null);

  // * Pagination settings.
  const [page, setPage] = useState(1);
  const itemsPerPage = perPage || 10;

  const { data, error, isLoading } = useSWR(
    { searchQuery, page, itemsPerPage },
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
    setPage(1);
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
            defaultValue="20"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="20">40</option>
          </select>
        </div>

        <div>
          <div className="bg-white shadow-xs flex items-center gap-3 px-3 py-1 rounded-xl">
            <Filter size={18} />
            <span>Filter</span>
          </div>
        </div>

        <div>
          <div className="bg-white shadow-xs flex items-center gap-3 px-3 py-1 rounded-xl">
            <Search size={18} />
            <span>Search</span>
          </div>
        </div>
      </div>

      <div className="py-3 px-2 bg-white drop-shadow-xs rounded-2xl">
        <table className="w-full text-left">
          <thead className="text-sm">
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Brand</th>
              <th>Active</th>
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

            {data?.data &&
              data.data.map((product, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 last:border-b-transparent"
                >
                  <td className="py-2 w-4/12">
                    <div>
                      <h5>
                        <Link href={"/dashboard/products/" + product.id}>
                          {product.name}
                        </Link>
                      </h5>
                    </div>
                  </td>
                  <td className="py-2 w-3/12">
                    <div>
                      <h5>{product.type}</h5>
                    </div>
                  </td>
                  <td className="py-2 w-3/12">
                    <div>
                      <h5>{product.brand.name}</h5>
                    </div>
                  </td>
                  <td className="py-2 w-2/12">
                    <CheckSquare size={20} className="text-slate-500" />
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
