import Link from "next/link";
import {
  PlusCircle,
  Filter,
  Search,
  CheckSquare,
  ChevronLeftCircle,
  ChevronRightCircle,
} from "lucide-react";

import prisma from "@/data/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    select: {
      name: true,
      type: true,
      brand: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <main className="py-7 px-3">
      <div className="mb-9 mt-8">
        <h1 className="text-2xl text-slate-700">Product List</h1>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-3 items-center justify-between mb-6">
          <div className="flex-grow">
            <Link
              href="/dashboard/products/add"
              className="w-full flex items-center gap-2 px-2 py-2 text-sm bg-slate-700 text-white rounded-xl"
            >
              <PlusCircle size={20} strokeWidth={2} />
              Add Product
            </Link>
          </div>

          <div>
            <button className="px-3 py-2 text-sm bg-slate-100 text-slate-800 rounded-l-xl border-r border-slate-200">
              Import
            </button>
            <button className="px-3 py-2 text-sm bg-slate-100 text-slate-800 rounded-r-xl">
              Export
            </button>
          </div>
        </div>

        <div className="flex-grow flex gap-3">
          <div className="flex-grow">
            <label htmlFor="showing" className="hidden md:inline-block">
              Showing
            </label>
            <select
              className="focus-visible:outline-0 rounded-xl px-3 py-1 border-r-10 border-transparent"
              name="showing"
              id="showing"
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
            {products.map((product, i) => (
              <tr
                key={i}
                className="border-b border-slate-200 last:border-b-transparent"
              >
                <td className="py-2 w-4/12">
                  <div>
                    <h5>{product.name}</h5>
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
          <span className="text-slate-600 text-xs">20 Pages</span>
        </div>
        <div className="flex-grow flex items-center justify-end gap-2 text-sm">
          <span className="px-3 py-2 rounded-full bg-white shadow-xs flex items-center gap-3">
            <ChevronLeftCircle size={18} />
            Previous
          </span>
          <span className="px-3 py-2 rounded-full bg-white shadow-xs flex items-center gap-3">
            Next
            <ChevronRightCircle size={18} />
          </span>
        </div>
      </div>
    </main>
  );
}
