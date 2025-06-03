import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { fnLogout } from "@/actions/logout";
import LogoutButton from "./logout-button";
import LinkLoading from "./link-loading";

export default function TopNavigation() {
  const router = useRouter();

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 pt-4 px-3 pr-5 z-30 w-full max-w-5xl flex flex-row justify-between items-center">
      <div className="flex-grow flex items-center gap-3">
        <motion.span
          whileTap={{ scale: 0.95, backgroundColor: "#f1f5f9" }}
          className="px-3 py-2 text-slate-600 rounded-xl"
        >
          <Link
            onClick={() => router.back()}
            href=""
            className="flex items-center sm:text-xl"
          >
            <ChevronLeft className="inline-block mr-1 w-[1.5em] h-[1.5em]" />{" "}
            Back <LinkLoading />
          </Link>
        </motion.span>
      </div>

      <div className="flex-grow flex justify-center">
        <Link href="/">
          <Image
            priority
            src="/img/logo.png"
            width={897}
            height={192}
            alt="Ironclad"
            className="w-24 opacity-50 sm:w-40"
          />
        </Link>
      </div>

      <div className="flex-grow flex justify-end">
        <motion.div
          whileTap={{ scale: 0.95, backgroundColor: "#f1f5f9" }}
          className="px-3 py-2 text-slate-800 cursor-pointer text-xl sm:text-2xl"
        >
          <LogoutButton logout={fnLogout} />
        </motion.div>
      </div>
    </div>
  );
}
