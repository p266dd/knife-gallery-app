"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Pencil, Save } from "lucide-react";

import Button from "@/ui/button";

export default function OrderAccordion({ orderProduct }) {
  const [open, setOpen] = useState(false);

  const product = orderProduct.product;

  // * Join the two tables product sizes and order details.
  const details = [];
  orderProduct.details.map((d) => {
    const match = product.sizes.find((s) => s.name === d.size);
    if (match) details.push({ ...match, ordered: d.ordered, id: d.id });
  });

  // * Dedicated Component to each size row.
  const ProductSizeRow = ({ size }) => {
    const [active, setActive] = useState(false);
    const [value, setValue] = useState(Number(size.ordered));

    const styles = {
      active: "w-12 bg-white border border-slate-600 rounded-lg",
      default: "px-2 border border-transparent",
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-3"
      >
        <div className="w-4/12 flex flex-col gap-1">
          <span>{size.name}</span>
          <span className="text-sm">
            {size.size} <span className="text-[10px] justify-self-end">mm</span>
          </span>
        </div>

        <div className="w-3/12 flex flex-col gap-1">
          <span className="text-[10px] text-slate-500">Ordered</span>
          <span>
            <input
              type="number"
              value={value}
              max={size.stock}
              className={`${styles.default} ${active && styles.active}`}
              disabled={!active}
              onChange={(e) => setValue(e.target.value)}
            />
          </span>
        </div>

        <div className="w-2/12 flex flex-col gap-1">
          <span className="text-[10px] text-slate-500">Extra</span>
          <span>{size.stock}</span>
        </div>

        <div className="w-3/12">
          {active ? (
            <Button
              size="sm"
              onClick={() => {
                setActive((prev) => !prev);
                // * Only allow to add what is available.
                if (value > size.stock) setValue(size.stock);
              }}
            >
              <span className="flex items-center gap-2">
                Save
                <Save size={12} />
              </span>
            </Button>
          ) : (
            <Button
              variant="flat"
              size="sm"
              onClick={() => setActive((prev) => !prev)}
            >
              <span className="flex items-center gap-2">
                Edit
                <Pencil size={12} />
              </span>
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  // * Main component.
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

      <motion
        className={`${open ? "h-auto rounded-b-xl" : "h-0"} bg-slate-100 overflow-hidden transition-all ease-out`}
      >
        <div className="py-3 px-2 flex flex-col gap-2 border-b border-slate-200 last:border-b-0">
          <AnimatePresence>
            {details.length > 0 &&
              details.map((detail, i) => (
                <ProductSizeRow key={i} size={detail} />
              ))}
          </AnimatePresence>
        </div>
      </motion>
    </div>
  );
}
