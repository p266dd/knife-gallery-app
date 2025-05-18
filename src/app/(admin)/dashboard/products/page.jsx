import Link from "next/link";
import prisma from "@/data/prisma";
import { Box, PlusCircle } from "lucide-react";

import ProductsTable from "@/ui/admin/products-table";
import LinkLoading from "@/ui/link-loading";

export default async function ProductsPage() {
  const filters = await prisma.filter.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="py-9 px-3">
      <div className="mb-9 flex items-center gap-4">
        <Box size={28} strokeWidth={1.5} className="text-slate-700" />
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
              Add Product <LinkLoading />
            </Link>
          </div>

          <div>
            <button className="px-3 py-2 text-sm bg-slate-100 text-slate-400 rounded-l-xl border-r border-slate-200">
              Import
            </button>
            <button className="px-3 py-2 text-sm bg-slate-100 text-slate-400 rounded-r-xl">
              Export
            </button>
          </div>
        </div>
      </div>

      <div>
        <ProductsTable filters={(filters && filters) || []} />
      </div>
    </main>
  );
}
