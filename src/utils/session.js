"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encrypt, decrypt } from "./jwt";

// * Creates a session cookie with users data.
// { id, name, email, role }
export async function createSession({ id, name, email, role }) {
  const cookieStore = await cookies();
  const expiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ id, name, email, role });

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiration,
    maxAge: 30 * 24 * 60 * 60,
    sameSite: "strict",
    path: "/",
  });
}

// * Delete session cookie.
export async function deleteSession() {
  const cookieStore = await cookies();
  return cookieStore.delete("session");
}

// * Returns decrypted session data from cookie or null.
// session { id, name, email, role}
export const getSession = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  const session = await decrypt(sessionCookie);
  return session;
};

// * Allow operation if user is logged in.
export const verifyUserSession = async () => {
  const session = await getSession();

  if (!session.id) {
    return redirect("/login");
  }

  return session;
};

// * only allow operation if user is an admin user.
export const verifyAdminSession = async () => {
  const session = await getSession();

  if (session.role !== "admin" && session.id) {
    return redirect("/");
  }

  if (!session.id) {
    return redirect("/login");
  }

  return session;
};
