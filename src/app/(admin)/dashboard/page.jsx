import { ShoppingBag } from "lucide-react";
import DashboardOrdersTable from "@/ui/components/dashboard-orders-table";

export default async function DashboardPage() {
  return (
    <div className="py-12 pr-3 pl-4">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <ShoppingBag size={28} strokeWidth={1.5} />
          <h1 className="text-2xl text-slate-700">New Orders</h1>
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
