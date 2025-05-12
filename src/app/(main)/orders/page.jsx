import OrdersTable from "@/ui/orders-table";

export default async function OrderHistoryPage() {
  return (
    <main className="pt-16 pb-40">
      <div className="px-6 mt-9 mb-12">
        <h1 className="text-4xl mb-2">Order History</h1>
      </div>

      <div className="px-6">
        <OrdersTable />
      </div>
    </main>
  );
}
