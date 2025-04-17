"use server";

import { cookies } from "next/headers";
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
