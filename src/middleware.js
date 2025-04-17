import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { decrypt } from "@/utils/jwt";

const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // decrypt the session from the cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  // if there is no session and route is private
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // if there is no session and route is public
  if (!session && isPublicRoute) {
    return NextResponse.next();
  }

  // if there is a session allow
  if (session && session.userId) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png|.*\\.ico$).*)"],
};
