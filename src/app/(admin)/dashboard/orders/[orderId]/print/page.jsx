"use client";

import { useParams } from "next/navigation";

export default function PrintOrderPage() {
  const params = useParams();
  console.log(params);
  return "";
}
