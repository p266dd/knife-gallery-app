"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ProductGallery from "./product-gallery";
import AddToFavortite from "./add-to-favorite";

import { CircleX } from "lucide-react";

export default function ProductModal({ product, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(undefined);
  const router = useRouter();

  useEffect(() => {
    let timer;
    let started;
    let hasMoved;

    // * Disabled context menu for the entire component.
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    // hide the default context menu on mobile browsers [iOS issue]
    triggerRef.current.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      return;
    });

    triggerRef.current.addEventListener("touchstart", () => {
      // simulate long press
      timer = setTimeout(() => {
        if (navigator?.vibrate) navigator?.vibrate([50]);
        setIsOpen(true);
      }, 500);

      started = new Date();
      return;
    });

    triggerRef.current.addEventListener("touchend", () => {
      clearTimeout(timer);

      const ended = new Date();
      const duration = (ended - started) / 100;
      const durationMs = Math.round(duration);

      if (durationMs <= 3 && !hasMoved) {
        // treat as a click
        router.push("/products/" + product.id);
      }
      return;
    });

    triggerRef.current.addEventListener("touchmove", (e) => {
      // cancel long hold and cancel tap
      clearTimeout(timer);
      hasMoved = true;
      return;
    });

    triggerRef.current.addEventListener("click", () => {
      return router.push("/products/" + product.id);
    });
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className="relative z-0 block w-full h-full min-h-36"
      >
        <span className="block w-full h-full absolute top-0 left-0 bg-transparent z-10"></span>
        {children}
      </div>

      {isOpen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full z-50 overflow-hidden flex items-center justify-center bg-black/70"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              className="relative w-10/12 px-4 py-5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-2 bg-white rounded-xl cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <CircleX className="inline-block mr-2" size={18} />
                    Close
                  </motion.div>
                </div>

                <div className="relative h-[65vh]">
                  <AddToFavortite productId={product.id} />
                  <ProductGallery product={product} />
                </div>

                <Link href={"/products/" + product.id || "#"}>
                  <div className="bg-white rounded-xl p-4">{product.name}</div>
                </Link>
              </div>
            </motion.div>
          </motion.div>,
          document.body,
          "productModal"
        )}
    </>
  );
}
