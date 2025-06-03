"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useActionState } from "react";
import { CirclePlus, Pencil, Trash2, ChevronDown, Loader } from "lucide-react";

import { addBrandAction, removeBrandAction, updateBrandAction } from "@/actions/brands";
import ConfirmModal from "../confirm-modal";

export default function ManageBrandsForm({ brands }) {
  const [edit, setEdit] = useState(false);
  const [editedBrand, setEditedBrand] = useState(null); // Stores the Brand object being edited
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState(false);

  const [aformState, aformAction, aisLoading] = useActionState(
    addBrandAction,
    { success: false, message: null, error: null, data: null } // Initial state
  );

  const [formState, formAction, isLoading] = useActionState(
    updateBrandAction,
    { success: false, message: null, error: null, data: null } // Initial state
  );

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-md">
      <div
        className={`flex items-center justify-between ${open ? "bg-slate-700" : "bg-slate-500"} text-white px-6 py-3 rounded-xl cursor-pointer`}
        onClick={() => {
          setOpen((prev) => !prev);
          // Reset edit mode when toggling the section
          if (open) {
            // If it was open and is now closing
            setEdit(false);
            setEditedBrand(null);
          }
        }}
      >
        <div className="flex-grow">
          <h2 className="text-lg">Manage Brands</h2>
          <p className="text-white/40 text-xs">Manage all available brands.</p>
        </div>
        <span>
          <ChevronDown className={`${open ? "rotate-180" : null}`} size={20} />
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <div className="mb-4 pt-6 px-2">
              {!edit && (
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                >
                  <form
                    action={aformAction}
                    // Reset form fields on successful submission when not in edit mode
                    ref={(formEl) => {
                      if (formEl && aformState?.success && !edit && aformState.data) {
                        formEl.reset();
                      }
                    }}
                    className="flex flex-col gap-3"
                  >
                    <div>
                      <label className="pl-2" htmlFor="brandName">
                        Brand Name
                      </label>
                      <input
                        required
                        name="brandName"
                        id="brandName"
                        placeholder="Brand Name"
                        autoComplete="off"
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      />
                    </div>

                    <div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEdit(false);
                          setEditedBrand(null);
                        }}
                        type="submit"
                        className={`w-full px-3 py-2 flex items-center justify-center gap-3 ${aisLoading ? "bg-slate-200 text-slate-700" : "bg-slate-700 text-white"} text-sm font-semibold rounded-xl`}
                      >
                        <CirclePlus size={16} /> {aisLoading ? "Saving..." : "Add Brand"}
                      </motion.button>
                    </div>

                    {aformState?.message && (
                      <div
                        className={`mt-2 text-sm ${aformState.success ? "p-2 rounded-xl bg-green-100 text-green-800" : "p-2 rounded-xl bg-red-100 text-red-800"}`}
                      >
                        <p>{aformState.message}</p>
                      </div>
                    )}
                    {aformState?.error && (
                      <div className="mt-2 p-2 rounded-xl bg-red-100 text-sm text-red-800">
                        <p>{aformState.error}</p>
                      </div>
                    )}
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
                  <form
                    action={formAction} // Reset form fields on successful submission when not in edit mode
                    className="flex flex-col gap-3"
                  >
                    {/* Hidden input to send messageId for updates */}
                    <input type="hidden" name="brandId" value={editedBrand?.id || ""} />
                    <div>
                      <label className="pl-2" htmlFor="brandName">
                        Brand Name
                      </label>
                      <input
                        required
                        name="brandName"
                        id="brandName"
                        placeholder="Brand Name"
                        autoComplete="off"
                        value={editedBrand?.name || ""}
                        onChange={(e) => setEditedBrand({ ...editedBrand, name: e.target.value })}
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className={`w-full px-3 py-2 flex items-center justify-center gap-3 ${isLoading ? "bg-green-100 text-green-800" : "bg-green-700 text-white"} text-sm font-semibold rounded-xl`}
                      >
                        <CirclePlus size={16} /> {isLoading ? "Saving Changes..." : "Save Changes"}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="w-3/12 px-3 py-2 flex items-center justify-center gap-3 bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl"
                        onClick={() => {
                          setEdit(false);
                          setEditedBrand(null);
                        }}
                      >
                        Cancel
                      </motion.button>
                    </div>

                    {formState?.message && (
                      <div
                        className={`mt-2 text-sm ${formState.success ? "p-2 rounded-xl bg-green-100 text-green-800" : "p-2 rounded-xl bg-red-100 text-red-800"}`}
                      >
                        <p>{formState.message}</p>
                      </div>
                    )}
                    {formState?.error && (
                      <div className="mt-2 p-2 rounded-xl bg-red-100 text-sm text-red-800">
                        <p>{formState.error}</p>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-56 overflow-scroll py-4 bg-white rounded-xl shadow-sm"
            >
              <table className="w-full text-left">
                <thead className="text-sm">
                  <tr>
                    <th className="pl-2">Available Brands</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {brands.length > 0 ? (
                    brands.map((brand, i) => (
                      <tr key={i} className="border-b border-slate-200 last:border-b-transparent">
                        <td className="py-2 px-2 w-9/12 h-10">
                          <span>{brand.name}</span>
                        </td>
                        <td className="py-2 w-3/12 flex items-center gap-5">
                          <button
                            onClick={() => {
                              setEdit(true);
                              setEditedBrand(brand);
                            }}
                          >
                            <Pencil className="text-blue-600" size={16} />
                          </button>
                          <ConfirmModal
                            action={() => {
                              setRemove(brand.id);
                              removeBrandAction(brand.id)
                                .then((_res) => setRemove(null))
                                .catch((_err) => setRemove(null));
                            }}
                          >
                            <button>
                              {remove === brand.id ? (
                                <Loader className="text-red-600 animate-spin" size={16} />
                              ) : (
                                <Trash2 className="text-red-600" size={16} />
                              )}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
