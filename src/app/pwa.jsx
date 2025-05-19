"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const installButton = useRef(null);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    let deferredEvent;

    window.addEventListener("beforeinstallprompt", (e) => {
      deferredEvent = e;
    });

    installButton.current.addEventListener("click", (e) => {
      if (deferredEvent) {
        deferredEvent.prompt();
      }
      setShowPrompt(false);
    });
  }, []);

  if (isStandalone) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, delay: 1, ease: "easeOut" },
          }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute left-1/2 top-5 -translate-x-1/2 w-8/12 py-4 px-8 bg-white shadow-xl rounded-xl"
        >
          {isIOS ? (
            <>
              <div className="relative flex items-center justify-center gap-3 mb-3">
                <div
                  className="absolute -top-7 -right-12 flex justify-center items-center w-10 h-10 bg-slate-800 text-white rounded-full"
                  onClick={() => setShowPrompt(false)}
                >
                  <X size={22} strokeWidth={2} />
                </div>
                <div>
                  <Image
                    src="/img/brand-icon.png"
                    alt="Ironclad Logo"
                    width={172}
                    height={169}
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h4 className="text-slate-700 text-xl">Install App</h4>
                </div>
              </div>
              <div className="text-slate-600">
                To install this app on your iOS device, tap the share button
                <span role="img" aria-label="share icon" className="mx-2">
                  ⎋
                </span>
                and then <span className="font-bold">"Add to Home Screen"</span>
                .
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <div>
                <Image
                  src="/img/brand-icon.png"
                  alt="Ironclad Logo"
                  width={172}
                  height={169}
                  className="w-8 h-8"
                />
              </div>
              <div>
                <button ref={installButton} className="text-slate-700 text-xl">
                  Install App
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
