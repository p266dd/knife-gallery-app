"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/utils/session";

export async function fnLogout() {
  await deleteSession();
  redirect("/login");
}
