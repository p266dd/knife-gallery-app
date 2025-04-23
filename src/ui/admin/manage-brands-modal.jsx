import { useState } from "react";
import { mutate } from "swr";
import { motion } from "motion/react";
import { CirclePlus, Settings, Trash2 } from "lucide-react";

import Modal from "../modal";

import { addBrand, removeBrand } from "@/actions/brands";

export default function ManageBrandsModal({ brands }) {
  const [newBrand, setNewBrand] = useState("");

  const addNewBrand = (e) => {
    e.preventDefault();

    // * Do nothing if the field is empty.
    if (newBrand === "") return;

    // * Add handle and clear newBrand input.
    addBrand({ brandName: newBrand })
      .then((res) => {
        setNewBrand("");
        mutate("fetchBrands");
      })
      .catch((error) => console.log(error));
  };

  const deleteBrand = (e, brandName) => {
    e.preventDefault();

    // * Delete handle.
    removeBrand({ brandName })
      .then((res) => mutate("fetchBrands"))
      .catch((error) => console.log(error));
  };

  return (
    <Modal
      trigger={
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="p-3 flex items-center gap-2 text-xs font-semibold text-white bg-slate-700 rounded-xl"
        >
          <Settings size={16} />
          brands
        </motion.button>
      }
    >
      <div className="flex flex-col gap-3">
        <input
          required
          name="brandName"
          placeholder="Brand Name"
          onChange={(e) => setNewBrand(e.target.value)}
          value={newBrand}
          className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="w-full px-3 py-2 flex items-center justify-center gap-3 bg-slate-700 text-white text-sm font-semibold rounded-xl"
          onClick={addNewBrand}
        >
          <CirclePlus size={16} /> Add Brand
        </motion.button>
      </div>
      <div className="h-auto max-h-52 overflow-y-auto">
        {brands && brands.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold">Existing Brands</h4>
            <ul className="flex flex-col gap-2 mt-2">
              {brands.map((brand, i) => (
                <li
                  key={`brand-${i}`}
                  className="flex items-center justify-between p-2 pr-4 border border-slate-200 rounded-lg"
                >
                  {brand.name}
                  <button
                    type="button"
                    className="text-red-600 cursor-pointer"
                    onClick={(e) => {
                      deleteBrand(e, brand.name);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
