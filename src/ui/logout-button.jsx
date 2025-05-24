"use client";

import { Lock } from "lucide-react";

export default function LogoutButton({ logout }) {
  return (
    <button
      className="flex items-center hover:cursor-pointer"
      onClick={() => logout()}
    >
      <Lock className="inline-block w-[0.7em] h-[0.7em] ml-1" />
    </button>
  );
}
