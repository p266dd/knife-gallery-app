"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Logo from "@/assets/logo.png";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image priority src={Logo} alt="Ironclad" className="w-52" />

        <div className="my-8 text-center">
          <h1 className="text-2xl font-light mb-3">
            Page <strong className="font-semibold">Not Found!</strong>
          </h1>
          <p className="text-base">
            Return to the{" "}
            <span className="underline" onClick={() => router.back()}>
              previous page
            </span>
          </p>
          <p>
            or{" "}
            <Link className="underline" href="/">
              Home page
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
