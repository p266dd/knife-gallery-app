"use client";

import { Loader } from "lucide-react";
import { useLinkStatus } from "next/link";

export default function LinkLoading() {
  const { pending } = useLinkStatus();
  return pending ? (
    <span>
      <Loader size={16} className="inline-block ml-1 animate-spin" />
    </span>
  ) : null;
}
