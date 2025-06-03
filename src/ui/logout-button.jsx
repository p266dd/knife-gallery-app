"use client";

import { Lock } from "lucide-react";

export default function LogoutButton({ logout }) {
  return (
    <button
      className="flex items-center hover:cursor-pointer bg-slate-800 rounded-full p-2 text-white"
      onClick={() => logout()}
    >
      <Lock className="inline-block w-[0.7em] h-[0.7em]" />
    </button>
  );
}
