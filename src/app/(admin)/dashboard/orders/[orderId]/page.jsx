import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/data/prisma";
import Button from "@/ui/button";

import { CheckCircle, Printer, Trash2 } from "lucide-react";
import OrderAccordion from "@/ui/admin/order-accordion";
import BackButton from "@/ui/back-button";
import OrderDetailsButtons from "@/ui/admin/order-details-buttons";

export default async function OrderPage({ params }) {
  const { orderId } = await params;

  const handles = await prisma.handle.findMany({ orderBy: { id: "asc" } });

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      code: true,
      completedAt: true,
      isCompleted: true,
      comment: true,
      createdAt: true,
      client: {
        select: {
          id: true,
          name: true,
          businessName: true,
        },
      },
      orderProduct: {
        select: {
          id: true,
          details: true,
          brand: true,
          handle: true,
          request: true,
          product: {
            include: {
              sizes: true,
              media: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    redirect("/dashboard");
  }

  return (
    <div className="py-12 pr-3 pl-4">
      <div className="mb-5">
        <BackButton />
      </div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-slate-700">Order Details</h1>
        <Link href={"/dashboard/orders/" + order?.id + "/print"}>
          <Button size="md">
            <Printer size={18} />
            Print
          </Button>
        </Link>
      </div>

      <div className="mb-8 flex items-end justify-start gap-10">
        <div>
          <h5 className="text-sm font-semibold mb-2">Order Reference</h5>
          <h4 className="text-2xl font-light mb-1">{order.code.split("-")[1]}</h4>
          <h6 className="text-xs text-slate-500 mb-1">
            <strong>Ordered: </strong>
            {new Date(order.createdAt).toISOString().substring(0, 16).split("T").join(" at ")}
          </h6>
          {order?.completedAt && (
            <div className="text-xs text-slate-500">
              <strong>Completed: </strong>
              {new Date(order.completedAt).toISOString().substring(0, 11).split("T")}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-2xl font-light mb-1">{order.client.businessName}</h4>
          <h6 className="text-xs text-slate-500">{order.client.name}</h6>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-3">
          <h3>Ordered Products</h3>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {order.orderProduct.map((product, i) => (
            <OrderAccordion key={i} orderProduct={product} handles={handles} />
          ))}
        </div>

        <OrderDetailsButtons orderId={order.id} isOrderCompleted={order.isCompleted} />
      </div>
    </div>
  );
}
