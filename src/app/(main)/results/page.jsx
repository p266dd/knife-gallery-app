"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create an object to hold the structured parameters.
  const searchObject = {};

  // Iterate over all keys.
  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key);
    // If there's more than one value, store it as an array, otherwise store the single value.
    searchObject[key] = values.length > 1 ? values : values[0];
  }

  return "";
}
