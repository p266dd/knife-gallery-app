"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";

import Button from "../button";
import OrderAccordionRow from "./order-accordion-row";
import { updateOrderProductDetailsProduct } from "@/actions/update-order-details";

export default function OrderAccordion({ orderProduct, handles }) {
  const [open, setOpen] = useState(false);
  const [otherField, setOtherField] = useState(false);

  const [showSave, setShowSave] = useState(false);
  const [data, setData] = useState({
    brand: orderProduct.brand,
    handle: orderProduct.handle,
    request: orderProduct.request,
    details: JSON.parse(orderProduct.details),
  });

  const product = orderProduct.product;

  // * Join product sizes and order details.
  const details = [];
  product.sizes.map((size) => {
    // * detail.id and size.id must always match.
    const match = data.details.find((detail) => Number(detail.id) === size.id);

    // * Add ordered field to product size if ids match.
    if (match)
      return details.push({ ...size, ordered: Number(match.quantity) });

    return details.push(size);
  });

  const handleSave = () => {
    updateOrderProductDetailsProduct({ docId: orderProduct.id, newData: data })
      .then((res) => setShowSave(false))
      .catch((error) => console.log(error));
  };

  return (
    <div className="bg-white px-3 first:rounded-t-xl">
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
        className={`${open ? "h-auto rounded-b-xl" : "h-0"} overflow-hidden transition-all ease-out`}
      >
        <div className="py-3 px-2 flex flex-col gap-2 border-b border-slate-200 last:border-b-0">
          <div className="flex flex-col gap-1 border border-slate-300 rounded-xl px-3 py-2">
            <label htmlFor="brand" className="text-sm">
              Brand
            </label>
            <div className="flex-grow">
              <select
                name="brand"
                id="brand"
                defaultValue={orderProduct.brand || product.brand}
                onChange={(e) => {
                  setShowSave(true);
                  if (e.target.value === "other") {
                    setOtherField(true);
                  } else {
                    setOtherField(false);
                    setData((prev) => {
                      return {
                        ...prev,
                        brand: e.target.value,
                      };
                    });
                  }
                }}
                className="w-full focus-visible:outline-0"
              >
                <option value="" disabled>
                  Select an engraving for this product.
                </option>

                {/* This is cart product config. */}
                {orderProduct && orderProduct.brand !== product.brand && (
                  <option value={orderProduct.brand}>
                    {orderProduct.brand}
                  </option>
                )}

                {/* This is the default products brand. */}
                <option value={product.brand}>{product.brand}</option>

                <option value="other">Other</option>
              </select>

              {otherField && (
                <input
                  type="text"
                  name="brandOther"
                  autoComplete="off"
                  placeholder="What do you want engraved?"
                  onChange={(e) => {
                    showSave ? null : setShowSave(true);
                    setData((prev) => ({ ...prev, brand: e.target.value }));
                  }}
                  className="focus-visible:outline-0 w-full placeholder:text-slate-500 px-4 py-2 bg-slate-100 rounded-xl"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 border border-slate-300 rounded-xl px-3 py-2">
            <label htmlFor="brand" className="text-sm">
              Handle
            </label>
            <div className="flex-grow">
              <select
                name="handle"
                id="handle"
                defaultValue={orderProduct.handle || product.handle}
                onChange={(e) => {
                  setShowSave(true);
                  setData((prev) => {
                    return {
                      ...prev,
                      handle: e.target.value,
                    };
                  });
                }}
                className="w-full focus-visible:outline-0"
              >
                <option value="" disabled>
                  Select a handle for this product.
                </option>

                {handles &&
                  handles.map((handle, i) => (
                    <option key={i} value={handle.name}>
                      {handle.name}
                    </option>
                  ))}

                {/* This is the default products handle. */}
                <option value={orderProduct.handle}>
                  {orderProduct.handle}
                </option>

                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1 border border-slate-300 rounded-xl px-3 py-2 mb-3">
            <p>Specific Request</p>
            <div className="text-sm bg-white">
              {orderProduct.request || "No special request."}
            </div>
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
            <div className="w-full flex">
              <Button onClick={() => handleSave()}>Save</Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
