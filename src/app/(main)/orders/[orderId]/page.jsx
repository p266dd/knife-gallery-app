import { fetchSingleOrder } from "@/actions/fetch-orders";
import OrdersRow from "@/ui/orders-row";

export default async function SingleOrderPage({ params }) {
  const { orderId } = await params;
  const order = await fetchSingleOrder({ orderId });

  return (
    <main className="pt-16 pb-40">
      <div className="px-6 mt-9 mb-12">
        <h1 className="text-4xl mb-2">Order Details</h1>
        <div className="mt-4 flex items-start justify-start gap-7">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-500">Order Reference</span>
            <span className="text-xl font-light text-slate-800">
              {order.id.split("-")[0]}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-500">Ordered By</span>
            <span className="text-xl font-light text-slate-800">
              {order.client.name}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6">
        <h5 className="text-lg font-semibold mb-4">Products</h5>

        <div>
          {order &&
            order.orderProduct.map((product, i) => (
              <OrdersRow key={i} orderProduct={product} />
            ))}
        </div>
      </div>
    </main>
  );
}
