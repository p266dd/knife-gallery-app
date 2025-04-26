"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

import {
  UserRoundCheck,
  Box,
  BadgeDollarSign,
  Settings,
  ChevronsRight,
  X,
  Undo2,
  Lock,
} from "lucide-react";

import { fnLogout } from "@/actions/logout";

export default function DashboardNavigation() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const navigationLinks = [
    {
      title: "Orders",
      url: "/dashboard",
      icon: <BadgeDollarSign strokeWidth={1.5} size={18} />,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: <Box strokeWidth={1.5} size={18} />,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: <UserRoundCheck strokeWidth={1.5} size={18} />,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings strokeWidth={1.5} size={18} />,
    },
    {
      title: "Homepage",
      url: "/",
      icon: <Undo2 strokeWidth={1.5} size={18} />,
    },
  ];

  return (
    <motion.div
      layout
      transition={{ type: "spring", duration: 0.25 }}
      className={`fixed top-0 left-0 z-50 px-2 h-full min-h-screen 
        flex flex-col gap-8 justify-center items-center 
        bg-slate-800 text-white ${open ? "shadow-2xl shadow-black w-auto" : "w-11 "}
        `}
    >
      <AnimatePresence>
        <motion.div layout className="w-full">
          <motion.button
            layout
            className={`w-full flex items-center justify-start gap-3 text-xs font-bold ${open ? "p-3" : "p-1"} rounded-full`}
            onClick={() => setOpen((prev) => !prev)}
          >
            <motion.span
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className={open ? "block" : "hidden"}
            >
              Close
            </motion.span>
            <motion.span layout className="bg-slate-900 rounded-full p-3">
              {open ? (
                <X size={18} strokeWidth={2} />
              ) : (
                <ChevronsRight size={18} strokeWidth={2} />
              )}
            </motion.span>
          </motion.button>
        </motion.div>

        {navigationLinks.map((link, i) => {
          return (
            <Link
              key={i}
              href={link.url}
              onClick={() => setOpen(false)}
              className="w-full"
            >
              <motion.div
                layout
                className={`w-full flex items-center justify-start gap-3 text-xs font-bold ${open ? "p-2" : "p-1"}`}
              >
                <motion.span
                  layout
                  className={`${link.url === path ? "bg-white text-slate-700 rounded-full p-1" : "rounded-full"}`}
                >
                  {link.icon}
                </motion.span>

                <motion.span
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={open ? "block" : "hidden"}
                >
                  {link.title}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}

        <button
          key="logout"
          onClick={async () => await fnLogout()}
          className="w-full"
        >
          <motion.div
            layout
            className={`w-full flex items-center justify-start gap-3 text-xs font-bold ${open ? "p-3" : "p-1"}`}
          >
            <span>
              <Lock strokeWidth={1.5} size={18} />
            </span>

            <motion.span
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className={open ? "block" : "hidden"}
            >
              Logout
            </motion.span>
          </motion.div>
        </button>
      </AnimatePresence>
    </motion.div>
  );
}
