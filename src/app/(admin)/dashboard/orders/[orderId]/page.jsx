import Link from "next/link";
import prisma from "@/data/prisma";
import Button from "@/ui/button";

import { Printer } from "lucide-react";
import OrderAccordion from "@/ui/components/order-accordion";

export default async function OrderPage({ params }) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      client: {
        select: {
          name: true,
          businessName: true,
        },
      },
      orderProduct: {
        select: {
          details: true,
          request: true,
          product: {
            include: {
              sizes: true,
              brand: true,
              media: true,
              thumbnail: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="py-12 pr-3 pl-4">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-slate-700">Order Details</h1>
        <Link href={"/dashboard/orders/print/" + order.id}>
          <Button size="md">
            <Printer size={18} className="inline-block mr-3" />
            Print
          </Button>
        </Link>
      </div>

      <div className="mb-8 flex items-end justify-start gap-10">
        <div>
          <h5 className="text-sm font-semibold mb-2">Order Reference</h5>
          <h4 className="text-2xl font-light mb-1">{order.code}</h4>
          <h6 className="text-xs text-slate-500">
            {new Date(order.createdAt)
              .toISOString()
              .substring(0, 16)
              .split("T")
              .join(" at ")}
          </h6>
        </div>

        <div>
          <h4 className="text-2xl font-light mb-1">
            {order.client.businessName}
          </h4>
          <h6 className="text-xs text-slate-500">{order.client.name}</h6>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-3">
          <h3>Ordered Products</h3>
        </div>

        <div className="flex flex-col gap-3">
          {order.orderProduct.map((product, i) => (
            <OrderAccordion key={i} orderProduct={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
