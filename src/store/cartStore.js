import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => (
      {
        cart: [],
      },
      {
        name: "cartStorage",
      }
    )
  )
);
