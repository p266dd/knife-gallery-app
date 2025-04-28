import { create } from "zustand";
import { persist } from "zustand/middleware";

import { fetchCart } from "@/actions/fetch-cart";

export const useStore = create(
  persist(
    (set, get) => ({
      // * Product filter functionality state.
      filter: "",
      addFilter: (filter) => {
        return set({ filter: String(filter) });
      },
      removeFilter: () => {
        const { filters } = get();
        return set({ filter: "" });
      },
    }),
    {
      name: "main-store",
    }
  )
);
