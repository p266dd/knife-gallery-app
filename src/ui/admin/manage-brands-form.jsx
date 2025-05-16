"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, CirclePlus, Pencil, Trash2 } from "lucide-react";

import { addBrand, removeBrand, updateBrand } from "@/actions/brands";
import ConfirmModal from "../confirm-modal";

export default function ManageBrandsForm({ brands }) {
  const [newBrand, setNewBrand] = useState("");
  const [edit, setEdit] = useState(false);
  const [edited, setEdited] = useState({});

  return (
    <div>
      <h2 className="text-xl mb-4">Manage Brands</h2>

      <AnimatePresence>
        <div className="mb-4">
          {!edit && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  newBrand !== "" && (await addBrand(newBrand));
                  setNewBrand("");
                }}
                className="flex flex-col gap-3"
              >
                <input
                  required
                  name="brandName"
                  placeholder="Brand Name"
                  autoComplete="off"
                  onChange={(e) => setNewBrand(e.target.value)}
                  value={newBrand}
                  className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                />

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="w-full px-3 py-2 flex items-center justify-center gap-3 bg-slate-700 text-white text-sm font-semibold rounded-xl"
                >
                  <CirclePlus size={16} /> Add Brand
                </motion.button>
              </form>
            </motion.div>
          )}

          {edit && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col gap-3 mb-3"
            >
              <input
                required
                name="brandName"
                placeholder="Brand Name"
                onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                value={edited?.name}
                className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
              />

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="w-9/12 px-3 py-2 flex items-center justify-center gap-3 bg-green-700 text-white text-sm font-semibold rounded-xl"
                  onClick={async () => {
                    setEdit(false);
                    await updateBrand(edited);
                  }}
                >
                  <Check size={16} /> Save
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="w-3/12 px-3 py-2 flex items-center justify-center gap-3 bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl"
                  onClick={async () => {
                    setEdit(false);
                    setEdited({});
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      <div className="max-h-56 overflow-scroll py-4 bg-white rounded-xl shadow-sm">
        <table className="w-full text-left">
          <thead className="text-sm">
            <tr>
              <th className="pl-2">Brands</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {brands.length > 0 ? (
              brands.map((brand, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 last:border-b-transparent"
                >
                  <td className="py-2 px-2 w-9/12 h-10">
                    <span>{brand.name}</span>
                  </td>
                  <td className="py-2 w-3/12 flex items-center gap-5">
                    <button
                      onClick={() => {
                        setEdit(true);
                        setEdited(brand);
                      }}
                    >
                      <Pencil className="text-blue-600" size={16} />
                    </button>
                    <ConfirmModal action={async () => removeBrand(brand.id)}>
                      <button>
                        <Trash2 className="text-red-600" size={16} />
                      </button>
                    </ConfirmModal>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-2">There is no brand registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
