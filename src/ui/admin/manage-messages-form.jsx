"use client";

import { useState, useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, ChevronDown, CirclePlus, Loader, Pencil, Trash2 } from "lucide-react";

import { addMessageAction, removeMessage, updateMessageAction } from "@/actions/messages";
import ConfirmModal from "../confirm-modal";

export default function ManageMessagesForm({ messages }) {
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const [editedMessage, setEditedMessage] = useState(null); // Stores the message object being edited
  const [open, setOpen] = useState(false);

  const [aformState, aformAction, aisLoading] = useActionState(
    addMessageAction,
    { success: false, message: null, error: null, data: null } // Initial state
  );

  const [uformState, uformAction, uisLoading] = useActionState(
    updateMessageAction,
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
            setEditedMessage(null);
          }
        }}
      >
        <div className="flex-grow">
          <h2 className="text-lg">Manage Messages</h2>
          <p className="text-white/40 text-xs">Set the message to appear on screen load.</p>
        </div>
        <span>
          <ChevronDown className={`${open ? "rotate-180" : null}`} size={20} />
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <div className="mb-4 py-6 px-2">
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
                      <label className="pl-2" htmlFor="messageTitle">
                        Message Title
                      </label>
                      <input
                        required
                        name="messageTitle"
                        id="messageTitle"
                        placeholder="type your message title"
                        autoComplete="off"
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="pl-2" htmlFor="messageContent">
                        Message Content
                      </label>
                      <textarea
                        required
                        name="messageContent"
                        id="messageContent"
                        placeholder="Type your message here..."
                        autoComplete="off"
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      ></textarea>
                    </div>

                    <div>
                      <label className="pl-2" htmlFor="messageLink">
                        Button
                      </label>
                      <input
                        name="messageLink"
                        id="messageLink"
                        type="text"
                        placeholder="https://iconclad.co.jp"
                        autoComplete="off"
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      />
                    </div>

                    <div className="my-4">
                      <label
                        htmlFor="isActive"
                        className="flex-grow px-3 py-2 pb-1 text-sm bg-slate-50 rounded-lg"
                      >
                        <input id="isActive" name="isActive" type="checkbox" className="mr-3" />
                        <span>Is Active</span>
                      </label>
                    </div>

                    <div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEdit(false);
                          setEditedMessage(null);
                        }}
                        type="submit"
                        className={`w-full px-3 py-2 flex items-center justify-center gap-3 ${aisLoading ? "bg-slate-200 text-slate-700" : "bg-slate-700 text-white"} text-sm font-semibold rounded-xl`}
                      >
                        <CirclePlus size={16} /> {aisLoading ? "Saving Message..." : "Add Message"}
                      </motion.button>
                    </div>

                    {aformState?.message && aformState.success && (
                      <div
                        className={`mt-2 text-sm ${aformState.success ? "p-2 rounded-xl bg-green-100 text-green-800" : "p-2 rounded-xl bg-red-100 text-red-800"}`}
                      >
                        <p>{aformState.message}</p>
                      </div>
                    )}
                    {aformState?.error && !aformState.success && (
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
                  <form action={uformAction} className="flex flex-col gap-3">
                    {/* Hidden input to send messageId for updates */}
                    <input type="hidden" name="messageId" value={editedMessage?.id || ""} />
                    <div>
                      <label className="pl-2" htmlFor="messageTitle">
                        Message Title
                      </label>
                      <input
                        required
                        name="messageTitle"
                        id="messageTitle"
                        placeholder="type your message title"
                        autoComplete="off"
                        defaultValue={editedMessage?.title || ""}
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="pl-2" htmlFor="messageContent">
                        Message Content
                      </label>
                      <textarea
                        required
                        name="messageContent"
                        id="messageContent"
                        placeholder="Type your message here..."
                        autoComplete="off"
                        defaultValue={editedMessage?.content || ""}
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      ></textarea>
                    </div>

                    <div>
                      <label className="pl-2" htmlFor="messageLink">
                        Button
                      </label>
                      <input
                        name="messageLink"
                        id="messageLink"
                        type="text"
                        placeholder="https://ironclad.co.jp"
                        autoComplete="off"
                        defaultValue={editedMessage?.link || ""}
                        className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                      />
                    </div>

                    <div className="my-4">
                      <label
                        htmlFor="isActive"
                        className="flex-grow px-3 py-2 pb-1 text-sm bg-slate-50 rounded-lg"
                      >
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          className="mr-3"
                          defaultChecked={editedMessage?.isActive || false}
                        />
                        <span>Is Active</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className={`w-full px-3 py-2 flex items-center justify-center gap-3 ${uisLoading ? "bg-green-100 text-green-800" : "bg-green-700 text-white"} text-sm font-semibold rounded-xl`}
                      >
                        <CirclePlus size={16} /> {uisLoading ? "Saving Changes..." : "Save Changes"}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="w-3/12 px-3 py-2 flex items-center justify-center gap-3 bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl"
                        onClick={() => {
                          setEdit(false);
                          setEditedMessage(null);
                        }}
                      >
                        Cancel
                      </motion.button>
                    </div>

                    {uformState?.message && (
                      <div
                        className={`mt-2 text-sm ${uformState.success ? "p-2 rounded-xl bg-green-100 text-green-800" : "p-2 rounded-xl bg-red-100 text-red-800"}`}
                      >
                        <p>{uformState.message}</p>
                      </div>
                    )}
                    {uformState?.error && (
                      <div className="mt-2 p-2 rounded-xl bg-red-100 text-sm text-red-800">
                        <p>{uformState.error}</p>
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
                    <th className="pl-2">Current Messages</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {messages.length > 0 ? (
                    messages.map((message, i) => (
                      <tr key={i} className="border-b border-slate-200 last:border-b-transparent">
                        <td className="py-2 px-2 w-9/12 h-10">
                          {message?.isActive && (
                            <BadgeCheck className="text-green-600 inline-block mr-1" size={20} />
                          )}
                          <span>{message.title}</span>
                        </td>
                        <td className="py-2 w-3/12 flex items-center gap-5">
                          <button
                            onClick={() => {
                              setEdit(true);
                              setEditedMessage(message);
                            }}
                          >
                            <Pencil className="text-blue-600" size={16} />
                          </button>
                          <ConfirmModal
                            action={() => {
                              setRemove(message.id);
                              removeMessage(message.id)
                                .then((_res) => setRemove(null))
                                .catch((_err) => setRemove(null));
                            }}
                          >
                            <button>
                              {remove === message.id ? (
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
                      <td className="py-4 px-2 text-gray-400">There are no messages saved.</td>
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
