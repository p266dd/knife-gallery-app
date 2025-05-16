"use client";

import { Lock } from "lucide-react";

export default function LogoutButton({ logout }) {
  return (
    <button className="flex items-center" onClick={async () => await logout()}>
      <Lock className="inline-block ml-1" size={14} />
    </button>
  );
}
