"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, CirclePlus, Pencil, Trash2 } from "lucide-react";

import { addHandle, removeHandle, updateHandle } from "@/actions/handles";

export default function ManageHandlesForm({ handles }) {
  const [newHandle, setNewHandle] = useState("");
  const [edit, setEdit] = useState(false);
  const [edited, setEdited] = useState({});

  return (
    <div>
      <h2 className="text-xl mb-4">Manage Handles</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {handles &&
          handles.map((handle, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 bg-white rounded-xl"
            >
              {handle.name}
              <span className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEdit(true);
                    setEdited(handle);
                  }}
                >
                  <Pencil className="text-blue-600" size={16} />
                </button>
                <button onClick={async () => removeHandle(handle.id)}>
                  <Trash2 className="text-red-600" size={16} />
                </button>
              </span>
            </div>
          ))}
      </div>
      <AnimatePresence>
        {edit && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-3 mb-3"
          >
            <input
              required
              name="handleName"
              placeholder="Handle Name"
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
                  await updateHandle(edited);
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
      </AnimatePresence>
      <motion.div layout className="flex flex-col gap-3">
        <input
          required
          name="handleName"
          placeholder="Handle Name"
          onChange={(e) => setNewHandle(e.target.value)}
          value={newHandle}
          className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="w-full px-3 py-2 flex items-center justify-center gap-3 bg-slate-700 text-white text-sm font-semibold rounded-xl"
          onClick={async () => {
            newHandle !== "" && (await addHandle(newHandle));
            setNewHandle("");
          }}
        >
          <CirclePlus size={16} /> Add Handle
        </motion.button>
      </motion.div>
    </div>
  );
}
