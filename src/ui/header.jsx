"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import {
  Star,
  Search,
  ShoppingBag,
  CircleUserRound,
  LayoutDashboard,
} from "lucide-react";

import TopNavigation from "./top-navigation";
import LinkLoading from "./link-loading";

export default function Header({ userRole = "user", cartCount = 0 }) {
  const pathname = usePathname();

  const navigationLinks = [
    {
      title: "Favorites",
      url: "/favorites",
      icon: <Star strokeWidth={1.5} size={28} />,
    },
    {
      title: "Search",
      url: "/search",
      icon: <Search strokeWidth={1.5} size={28} />,
    },
    {
      title: "Cart",
      url: "/cart",
      icon: <ShoppingBag strokeWidth={1.5} size={28} />,
    },
    {
      title: "Account",
      url: "/account",
      icon: <CircleUserRound strokeWidth={1.5} size={28} />,
    },
  ];

  return (
    <>
      {pathname === "/" ? null : <TopNavigation />}

      <header className="fixed w-full p-3 z-30 bottom-0 left-0">
        <nav className="grid grid-cols-4 gap-2 p-2 justify-between max-w-[600px] mx-auto bg-slate-800 text-white rounded-2xl">
          {navigationLinks.map((link, i) => {
            return (
              <motion.div
                key={i}
                whileTap={{ scale: 0.95 }}
                className={`flex-grow px-4 py-2 rounded-2xl ${pathname === link.url ? "border-b-4 border-slate-700 bg-slate-900" : null}`}
              >
                <Link
                  className="relative flex flex-col items-center gap-2 py-1"
                  href={link.url}
                >
                  {link.icon}
                  {link.title === "Cart" && cartCount > 0 ? (
                    <span className="absolute -top-2 right-0 py-1 px-2 text-xs text-white bg-red-600 rounded-full">
                      {cartCount}
                    </span>
                  ) : null}
                  <span className="tracking-wider"> {link.title}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
        {userRole && userRole == "admin" && (
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 mt-2 px-4 py-2 max-w-[600px] mx-auto bg-slate-800 text-white rounded-2xl"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
            <LinkLoading />
          </Link>
        )}
      </header>
    </>
  );
}
