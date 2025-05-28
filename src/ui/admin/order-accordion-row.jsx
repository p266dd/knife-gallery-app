import { useState } from "react";
import { motion } from "motion/react";
import { Pencil, Save } from "lucide-react";

import Button from "@/ui/button";

import { updateOrderProductDetailsRow } from "@/actions/update-order-details";

export default function OrderAccordionRow({ details, docId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(details.ordered);

  const handleSave = () => {
    setLoading(true);

    const newData = {
      id: details.id,
      quantity: value,
    };

    setActive(false);

    // * Update details where id is docId - id is details.id
    updateOrderProductDetailsRow({
      docId,
      newData,
    })
      .then((res) => setLoading(false))
      .catch((e) => setError("Something went wrong."));
  };

  const styles = {
    active: "w-12 text-center border border-slate-500 rounded-lg",
    default: "px-2 focus-visible:outline-0",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-3 py-2 flex items-center gap-3 border border-slate-300 bg-white rounded-xl"
    >
      <div className="w-4/12 flex flex-col gap-1">
        <span>{details.name}</span>
        <span className="text-sm">
          {details.size}{" "}
          <span className="text-[10px] justify-self-end">mm</span>
        </span>
      </div>

      <div className="w-3/12 flex flex-col gap-1">
        <span className="text-[10px] text-slate-500">Ordered</span>
        <span>
          <input
            type="number"
            value={value}
            name="ordered"
            className={`${styles.default} ${active && styles.active}`}
            disabled={!active}
            onChange={(e) => {
              if (e.target.value > details.stock)
                return setValue(details.stock);
              setValue(e.target.value);
            }}
          />
        </span>
      </div>

      <div className="w-2/12 flex flex-col gap-1">
        <span className="text-[10px] text-slate-500">Stock</span>
        <span>{details.stock}</span>
      </div>

      <div className="w-3/12">
        {active || loading ? (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => {
              // * Only allow to add what is available.
              if (value > details.stock) {
                setValue(details.stock);
              } else {
                return handleSave();
              }
            }}
          >
            <span className="flex items-center gap-2">
              {loading ? "..." : "Save"}
              <Save size={12} />
            </span>
          </Button>
        ) : (
          <Button
            variant={error ? "danger" : "flat"}
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
}
