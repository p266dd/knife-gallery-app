"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useActionState } from "react";
import { ChevronDown, CirclePlus, Pencil, Trash2 } from "lucide-react";

import { addFilterAction, removeFilterAction, updateFilterAction } from "@/actions/filters";
import ConfirmModal from "../confirm-modal";

export default function ManageFiltersForm({ filters }) {
  const [edit, setEdit] = useState(false);
  const [editedFilter, setEditedFilter] = useState(null); // Stores the Filter object being edited
  const [open, setOpen] = useState(false);

  const [aformState, aformAction, aisLoading] = useActionState(
    addFilterAction,
    { success: false, message: null, error: null, data: null } // Initial state
  );

  const [formState, formAction, isLoading] = useActionState(
    updateFilterAction,
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
            setEditedFilter(null);
          }
        }}
      >
        <div className="flex-grow">
          <h2 className="text-lg">Manage Filters</h2>
          <p className="text-white/40 text-xs">Manage all available filters.</p>
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
                    ref={(formEl) => {
                      if (formEl && aformState?.success && !edit && aformState.data) {
                        formEl.reset();
                      }
                    }}
                    className="flex flex-col gap-3"
                  >
                    <div>
                      <label className="pl-2" htmlFor="filterName">
                        Filter Name
                      </label>
                      <input
                        required
                        name="filterName"
                        id="filterName"
                        placeholder="Filter Name"
                        autoComplete="off"
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      />
                    </div>

                    <div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        disabled={aisLoading}
                        className={`w-full px-3 py-2 flex items-center justify-center gap-3 ${aisLoading ? "bg-slate-200 text-slate-700 cursor-not-allowed" : "bg-slate-700 text-white"} text-sm font-semibold rounded-xl`}
                      >
                        <CirclePlus size={16} /> {aisLoading ? "Saving..." : "Add Filter"}
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
                  <form action={formAction} className="flex flex-col gap-3">
                    <input type="hidden" name="filterId" value={editedFilter?.id || ""} />
                    <div>
                      <label className="pl-2" htmlFor="filterName">
                        Filter Name
                      </label>
                      <input
                        required
                        name="filterName"
                        id="filterName"
                        placeholder="Filter Name"
                        autoComplete="off"
                        defaultValue={editedFilter?.name || ""}
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-3 py-2 flex items-center justify-center gap-3 ${isLoading ? "bg-green-100 text-green-800 cursor-not-allowed" : "bg-green-700 text-white"} text-sm font-semibold rounded-xl`}
                      >
                        <CirclePlus size={16} /> {isLoading ? "Saving Changes..." : "Save Changes"}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="w-3/12 px-3 py-2 flex items-center justify-center gap-3 bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl"
                        onClick={() => {
                          setEdit(false);
                          setEditedFilter(null);
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
                    <th className="pl-2">Available Filters</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filters.length > 0 ? (
                    filters.map((filter) => (
                      <tr
                        key={filter.id} // Use filter.id for key
                        className="border-b border-slate-200 last:border-b-transparent"
                      >
                        <td className="py-2 px-2 w-9/12 h-10">
                          <span>{filter.name}</span>
                        </td>
                        <td className="py-2 w-3/12 flex items-center gap-5">
                          <button
                            onClick={() => {
                              setEdit(true);
                              setEditedFilter(filter);
                            }}
                          >
                            <Pencil className="text-blue-600" size={16} />
                          </button>
                          <ConfirmModal action={async () => removeFilterAction(filter.id)}>
                            <button>
                              <Trash2 className="text-red-600" size={16} />
                            </button>
                          </ConfirmModal>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 px-2 text-gray-400">There are no registered filters.</td>
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
