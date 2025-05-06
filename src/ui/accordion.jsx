"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between px-3 py-2 text-white bg-slate-500 rounded-xl ${open ? "rounded-b-none" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <h5 className="flex-grow">{title || "Heading"}</h5>
        <span>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </div>

      <div
        className={`px-3 bg-white overflow-hidden transition-all duration-300 ease-in-out ${open ? "h-auto pt-3 pb-5" : "h-0"}`}
      >
        {children}
      </div>
    </div>
  );
}
