"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share, X } from "lucide-react";

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
    <div className="relative z-20">
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
            className="absolute left-1/2 top-5 -translate-x-1/2 w-9/12 py-4 px-8 bg-white shadow-xl rounded-xl"
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
                  <div className="mb-3">
                    How to install this app on your iOS device.
                    <br />
                    1. tap the{" "}
                    <span className="underline font-semibold">
                      share button
                    </span>
                    <span role="img" aria-label="share icon" className="mx-2">
                      <Share size={22} className="text-blue-700 inline-block" />
                    </span>{" "}
                    <br />
                    2. Then, tap the
                    <span className="underline font-semibold ml-2">
                      Add to Home Screen
                    </span>
                    .
                  </div>
                  <div className="flex flex-row">
                    <button
                      onClick={() => {
                        setShowPrompt(false);
                        // set cookie doNotDisplayPrompt
                        document.cookie = "doNotDisplayPrompt=true";
                      }}
                      className="flex-grow px-4 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl"
                    >
                      Don't Show Again
                    </button>
                  </div>
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
                  <button
                    ref={installButton}
                    className="text-slate-700 text-xl"
                  >
                    Install App
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
