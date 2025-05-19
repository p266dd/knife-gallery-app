"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CirclePlus, Pencil, Trash2 } from "lucide-react";

import { addMessage, removeMessage, updateMessage } from "@/actions/messages";
import ConfirmModal from "../confirm-modal";

export default function ManageMessagesForm({ messages }) {
  const [newMessage, setNewMessage] = useState({});
  const [edit, setEdit] = useState(false);
  const [edited, setEdited] = useState({});

  return (
    <div>
      <h2 className="text-xl mb-4">Manage Messages</h2>

      <AnimatePresence>
        <div className="mb-4">
          {!edit && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  newMessage && addMessage(newMessage);
                  setNewMessage({});
                }}
                className="flex flex-col gap-3"
              >
                <input
                  required
                  name="messageTitle"
                  placeholder="Message Title"
                  autoComplete="off"
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      title: e.target.value,
                    })
                  }
                  value={(newMessage?.title && newMessage.title) || ""}
                  className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                />

                <textarea
                  required
                  name="messageContent"
                  placeholder="Type your message here..."
                  autoComplete="off"
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      content: e.target.value,
                    })
                  }
                  value={(newMessage?.content && newMessage.content) || ""}
                  className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                ></textarea>

                <input
                  name="messageLink"
                  type="text"
                  placeholder="https://example.com"
                  autoComplete="off"
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      link: e.target.value,
                    })
                  }
                  value={(newMessage?.link && newMessage.link) || ""}
                  className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
                />

                <label
                  htmlFor="isActive"
                  className="flex-grow px-3 py-2 pb-1 text-sm bg-slate-50 rounded-lg"
                >
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    className="mr-3"
                    defaultChecked={newMessage?.isActive || false}
                    onChange={(e) => {
                      setNewMessage({
                        ...newMessage,
                        isActive: e.target.checked,
                      });
                    }}
                  />
                  Is Active
                </label>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="w-full px-3 py-2 flex items-center justify-center gap-3 bg-slate-700 text-white text-sm font-semibold rounded-xl"
                >
                  <CirclePlus size={16} /> Add Message
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
                name="messageTitle"
                placeholder="Message Title"
                autoComplete="off"
                onChange={(e) =>
                  setEdited({
                    ...edited,
                    title: e.target.value,
                  })
                }
                value={edited?.title && edited.title}
                className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
              />

              <textarea
                required
                name="messageContent"
                placeholder="Type your message here..."
                autoComplete="off"
                onChange={(e) =>
                  setEdited({
                    ...edited,
                    content: e.target.value,
                  })
                }
                value={edited?.content && edited.content}
                className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
              ></textarea>

              <input
                name="messageLink"
                placeholder="https://example.com"
                autoComplete="off"
                onChange={(e) =>
                  setEdited({
                    ...edited,
                    link: e.target.value,
                  })
                }
                value={(edited?.link && edited.link) || ""}
                className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-300 rounded-xl bg-white shadow-xs"
              />

              <label
                htmlFor="isActive"
                className="flex-grow px-3 py-2 pb-1 text-sm bg-slate-50 rounded-lg"
              >
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  className="mr-3"
                  defaultChecked={edited?.isActive}
                  onChange={(e) => {
                    setEdited({
                      ...edited,
                      isActive: e.target.checked,
                    });
                  }}
                />
                Is Active
              </label>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="w-9/12 px-3 py-2 flex items-center justify-center gap-3 bg-green-700 text-white text-sm font-semibold rounded-xl"
                  onClick={() => {
                    setEdit(false);
                    updateMessage(edited);
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
              <th className="pl-2">Messages</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {messages.length > 0 ? (
              messages.map((message, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 last:border-b-transparent"
                >
                  <td className="py-2 px-2 w-9/12 h-10">
                    <span>{message.title}</span>
                  </td>
                  <td className="py-2 w-3/12 flex items-center gap-5">
                    <button
                      onClick={() => {
                        setEdit(true);
                        setEdited(message);
                      }}
                    >
                      <Pencil className="text-blue-600" size={16} />
                    </button>
                    <ConfirmModal
                      action={async () => removeMessage(message.id)}
                    >
                      <button>
                        <Trash2 className="text-red-600" size={16} />
                      </button>
                    </ConfirmModal>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-2">There is no message.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
