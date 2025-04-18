"use client";

import { useState } from "react";

export default function OrderAccordion({ orderProduct }) {
  const [open, setOpen] = useState(false);

  const product = orderProduct.product;

  return (
    <div>
      <div
        className="py-3 border-b-3 border-slate-600"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h4 className="mb-1 text-lg font-light">{product.name}</h4>
        <div className="flex flex-col text-xs text-slate-700 font-light">
          <p>
            <span className="font-semibold mr-2">Brand:</span>
            {product.brand.name}
          </p>
          <p>
            <span className="font-semibold mr-2">Handle:</span>
            {product.handle}
          </p>
          <p>
            <span className="font-semibold mr-2">Request:</span>
            {orderProduct.request}
          </p>
        </div>
      </div>

      <div className={`${open ? "h-auto" : "h-0"} overflow-hidden`}>
        <div className="py-3">Details</div>
      </div>
    </div>
  );
}
