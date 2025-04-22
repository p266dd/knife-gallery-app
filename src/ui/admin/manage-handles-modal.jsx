import { useState } from "react";
import useSWR from "swr";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";

import Modal from "../modal";

import { addHandle, removeHandle } from "@/actions/handles";

export default function ManageHandlesModal({ handles }) {
  const [newHandle, setNewHandle] = useState(null);

  const addNewHandle = (e) => {
    e.preventDefault();

    // * Do nothing if the field is empty.
    if (newHandle === "") return;

    // * Add handle and clear newHandle input.
    const addedHandle = useSWR({ handleName: newHandle }, addHandle);
    return setNewHandle("");
  };

  const deleteHandle = (e, handleName) => {
    e.preventDefault();

    // * Delete handle.
    const removedHandle = useSWR({ handleName }, removeHandle);
  };

  return (
    <Modal
      trigger={
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="p-3 flex items-center gap-2 text-xs font-semibold text-white bg-slate-700 rounded-xl"
        >
          Manage Handles
        </motion.button>
      }
    >
      <div className="flex flex-col gap-3">
        <input
          required
          name="handleName"
          placeholder="Handle Name"
          onChange={(e) => setNewHandle(e.target.value)}
          value={newHandle}
          className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="w-full px-3 py-2 bg-slate-700 text-white text-sm font-semibold rounded-xl"
          onClick={addNewHandle}
        >
          Add Handle
        </motion.button>
      </div>
      <div className="h-auto max-h-52 overflow-y-auto">
        {handles && handles.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold">Existing Handles</h4>
            <ul className="flex flex-col gap-2 mt-2">
              {handles.map((handle, i) => (
                <li
                  key={`handle-${i}`}
                  className="flex items-center justify-between p-2 pr-4 border border-slate-200 rounded-lg"
                >
                  {handle.name}
                  <button
                    type="button"
                    className="text-red-600 cursor-pointer"
                    onClick={(e) => {
                      deleteHandle(e, handle.name);
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
