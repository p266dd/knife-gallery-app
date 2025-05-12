"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function OrdersRow({ orderProduct }) {
  const [open, setOpen] = useState(false);

  if (!orderProduct) {
    return null;
  }

  return (
    <div className="relative">
      <div className="mb-2">
        <motion.div
          whileTap={{ scale: 0.9, backgroundColor: "#f3f3f3" }}
          className="flex items-center p-2 gap-4 rounded-xl"
        >
          <div className="relative w-1/4 h-28 rounded-xl overflow-hidden">
            <Image
              src={
                orderProduct.product.thumbnail?.url ||
                "/img/product-image-placeholder.webp"
              }
              alt={orderProduct.product.name || "Product Image"}
              className="object-cover"
              fill
            />
          </div>

          <div className="w-3/4" onClick={() => setOpen((prev) => !prev)}>
            <h3>{orderProduct.product.name}</h3>
            <h5 className="text-xs text-slate-600">
              <ul>
                <li>
                  Brand: {orderProduct.brand || orderProduct.product.brand}
                </li>

                {
                  // Only display this info for knives.
                  orderProduct.product.type === "knife" && (
                    <li>Handle: {orderProduct.handle}</li>
                  )
                }

                <li>Request: {orderProduct?.request.substring(0, 20)}</li>
              </ul>
            </h5>
          </div>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`rounded-xl bg-white border border-slate-300`}
            >
              <div className="py-2 px-4">
                <table className="w-full">
                  <thead>
                    <tr className="w-full text-xs text-white bg-slate-600">
                      <th className="w-5/12 py-1 px-2 text-left">Size</th>
                      <th className="w-3/12 py-1 px-2 text-center">Ordered</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orderProduct.product.sizes.map((size, i) => {
                      const ordered = JSON.parse(orderProduct?.details).find(
                        (d) => Number(d.id) === Number(size.id)
                      );

                      console.log(i, ordered);

                      if (!ordered.quantity) {
                        return null;
                      }

                      return (
                        <tr key={`size_${i}`}>
                          <td className="py-2 pl-2 text-left">
                            <span className="text-base mb-1 mr-2">
                              {size.name}
                            </span>
                            <span className="text-base">{size.size} mm</span>
                          </td>
                          <td className="py-2 text-center">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl">
                              <input
                                className="w-full appearance-none focus-visible:outline-0 placeholder:text-slate-500"
                                type="number"
                                name={`size_${size.id}`}
                                value={ordered.quantity}
                                readOnly={true}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex flex-col gap-3 py-3">
                  <div className="relative flex gap-2 items-center px-2 py-1 pt-6">
                    <label
                      className="absolute top-0 left-2 text-[10px] text-slate-700"
                      htmlFor="brand"
                    >
                      Engraving
                    </label>

                    <div className="flex-grow">
                      <input
                        type="text"
                        name="brand"
                        value={orderProduct.brand}
                        readOnly={true}
                        className="w-full focus-visible:outline-0 border-b border-slate-300 pb-2"
                      />
                    </div>
                  </div>

                  {orderProduct.product.type === "knife" && (
                    <div className="relative flex gap-2 items-center px-2 py-1 pt-6">
                      <label
                        className="absolute top-0 left-2 text-[10px] text-slate-700"
                        htmlFor="handle"
                      >
                        Handle
                      </label>
                      <input
                        type="text"
                        name="handle"
                        id="handle"
                        value={
                          orderProduct.handle || orderProduct.product.handle
                        }
                        readOnly={true}
                        className="focus-visible:outline-0 w-full placeholder:text-slate-500 text-sm  border-b border-slate-300 pb-2"
                      />
                    </div>
                  )}

                  <div className="relative flex gap-2 items-center px-2 py-1 pt-6">
                    <label
                      className="absolute top-0 left-2 text-[10px] text-slate-700"
                      htmlFor="request"
                    >
                      Special Request
                    </label>
                    <textarea
                      name="request"
                      id="request"
                      value={orderProduct.request}
                      readOnly={true}
                      className="focus-visible:outline-0 w-full placeholder:text-slate-500 text-base  border-b border-slate-300 pb-2"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
