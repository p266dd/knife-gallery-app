"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";

import Button from "../button";
import OrderAccordionRow from "./order-accordion-row";
import { updateOrderProductDetailsProduct } from "@/actions/update-order-details";

export default function OrderAccordion({ orderProduct }) {
  const [open, setOpen] = useState(false);

  const [showSave, setShowSave] = useState(false);
  const [data, setData] = useState({
    brand: orderProduct.brand,
    handle: orderProduct.handle,
    request: orderProduct.request,
  });

  const product = orderProduct.product;
  const orderDetails = JSON.parse(orderProduct.details);

  // * Join product sizes and order details.
  const details = [];
  orderDetails.map((d) => {
    // d.id is from the JSON content.
    // s.id is the product size id.
    // d.id and s.id must always match.
    const match = product.sizes.find((s) => s.id === d.id);
    if (match) details.push({ ...match, ordered: d.ordered });
  });

  const handleSave = () => {
    updateOrderProductDetailsProduct({ docId: orderProduct.id, newData: data })
      .then((res) => setShowSave(false))
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <div
        className="py-3 flex items-center justify-between border-b-3 border-slate-600"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <h4 className="mb-1 text-lg font-light">{product.name}</h4>
          <div className="flex flex-col text-xs text-slate-700 font-light">
            <p>
              <span className="font-semibold mr-2">Brand:</span>
              {data.brand}
            </p>
            <p>
              <span className="font-semibold mr-2">Handle:</span>
              {data.handle}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-12 font-semibold">Request</span>
              <span className="flex-grow max-w-32 text-nowrap overflow-ellipsis overflow-hidden">
                {data.request || "No special request."}
              </span>
            </p>
          </div>
        </div>

        <div className="px-2">
          {open ? (
            <span className="block p-1 bg-slate-800 text-white rounded-full">
              <ChevronUp size={20} />
            </span>
          ) : (
            <span className="block p-1 bg-white text-slate-800 rounded-full">
              <ChevronDown size={20} />
            </span>
          )}
        </div>
      </div>

      <motion.div
        className={`${open ? "h-auto rounded-b-xl" : "h-0"} bg-slate-100 overflow-hidden transition-all ease-out`}
      >
        <div className="py-3 px-2 flex flex-col gap-2 border-b border-slate-200 last:border-b-0">
          <div className="flex flex-col gap-1">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              name="brand"
              id="brand"
              onChange={(e) => {
                setShowSave(true);
                setData((prev) => ({ ...prev, brand: e.target.value }));
              }}
              defaultValue={orderProduct.brand}
              className="px-2 py-1 text-sm bg-white border border-slate-300 rounded-xl focus-visible:outline-0"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="handle">Handle</label>
            <input
              type="text"
              name="handle"
              id="handle"
              onChange={(e) => {
                setShowSave(true);
                setData((prev) => ({ ...prev, handle: e.target.value }));
              }}
              defaultValue={orderProduct.handle}
              className="px-2 py-1 text-sm bg-white border border-slate-300 rounded-xl focus-visible:outline-0"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="request">Specific Request</label>
            <textarea
              name="request"
              id="request"
              defaultValue={orderProduct.request || "No special request."}
              onChange={(e) => {
                setShowSave(true);
                setData((prev) => ({ ...prev, request: e.target.value }));
              }}
              className="px-2 py-1 text-sm bg-white border border-slate-300 rounded-xl focus-visible:outline-0"
            />
          </div>

          <AnimatePresence>
            {details.length > 0 &&
              details.map((size, i) => (
                <OrderAccordionRow
                  key={i}
                  docId={orderProduct.id}
                  details={size}
                />
              ))}
          </AnimatePresence>

          {showSave && (
            <div className="flex">
              <Button onClick={() => handleSave()}>Save</Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
