"use client";

import { createPortal } from "react-dom";
import { useState, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "motion/react";

import { CircleX } from "lucide-react";

export default function Modal({ children, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(undefined);

  return (
    <Fragment>
      <span ref={triggerRef} onClick={() => setIsOpen(true)}>
        {trigger}
      </span>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 w-full min-h-screen h-full z-50 overflow-hidden flex items-center justify-center bg-black/70"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.2 }}
                className="relative w-10/12 px-4 py-5"
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-6 right-4 text-slate-700 bg-white shadow-xs rounded-full p-2"
                >
                  <CircleX size={18} />
                </button>

                <div className="flex flex-col gap-3 px-4 py-2 pt-5 bg-white rounded-xl">
                  {children}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body,
          "modal"
        )}
    </Fragment>
  );
}
