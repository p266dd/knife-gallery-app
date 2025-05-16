"use client";
import useSWR from "swr";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import { fetchActiveMessage } from "@/actions/fetch-messages";
import Link from "next/link";

export default function DisplayMessage() {
  const SESSION_KEY = "hasSessionMessageBeenShown";

  const [message, setMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { data, error, isLoading } = useSWR("fetchMessage", fetchActiveMessage);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem(SESSION_KEY);

    if (!hasBeenShown && !isLoading && !error) {
      data &&
        setMessage({
          title: data?.title,
          content: data?.content,
          link: data?.link,
        });
      setIsVisible(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  }, [isLoading, data]);

  return isVisible && message ? (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 w-full min-h-screen h-full z-[60] overflow-hidden flex items-center justify-center bg-black/80"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.2 }}
          className="relative w-10/12 px-4 py-5"
        >
          <div className="flex flex-col gap-3 items-center py-7 px-5 bg-white rounded-xl">
            <div className="w-10">
              <Image
                src="/img/brand-icon.png"
                alt="Ironclad Logo"
                width={172}
                height={169}
              />
            </div>
            {message && (
              <>
                <h4 className="text-2xl text-slate-800">{message.title}</h4>
                <p className="text-sm text-slate-600">{message.content}</p>
                <div className="flex items-center gap-3 pt-8">
                  {message.link && (
                    <Link
                      className="px-4 py-2 bg-slate-800 text-slate-100 text-sm rounded-xl"
                      href={message.link}
                    >
                      Link
                    </Link>
                  )}
                  <button
                    className="px-4 py-2 bg-slate-200 text-slate-800 text-sm rounded-xl"
                    onClick={() => setIsVisible(false)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : (
    ""
  );
}
