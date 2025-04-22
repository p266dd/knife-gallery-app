import Link from "next/link";
import { CirclePlus, ShoppingBag } from "lucide-react";
import DashboardOrdersTable from "@/ui/admin/orders-table";

export default async function DashboardPage() {
  return (
    <div className="py-12 pr-6 pl-4">
      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <ShoppingBag size={28} strokeWidth={1.5} />
            <h1 className="text-2xl text-slate-700">New Orders</h1>
          </div>
          <Link
            className="flex items-center gap-2 px-3 py-2 text-white text-sm bg-slate-800 rounded-xl"
            href="/dashboard/orders/add"
          >
            <CirclePlus size={16} />
            <span>Order</span>
          </Link>
        </div>

        <div className="w-full overflow-scroll">
          <DashboardOrdersTable perPage={5} newOrders={true} />
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl text-slate-700">Orders History</h1>
        </div>

        <div className="w-full overflow-scroll">
          <DashboardOrdersTable />
        </div>
      </div>
    </div>
  );
}
