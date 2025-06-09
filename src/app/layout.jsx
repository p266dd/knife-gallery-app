import { cookies } from "next/headers";
import { Open_Sans } from "next/font/google";
import "./globals.css";

import { InstallPrompt } from "./pwa";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["300", "400", "600", "700"],
});

export const metadata = {
  title: "Knife Gallery App",
  description: "Created using Next.js",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 3,
  userScalable: true,
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const doNotDisplayPrompt = cookieStore.get("doNotDisplayPrompt");

  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="apple-mobile-web-app-title" content="Ironclad" />
        <meta name="application-name" content="Ironclad" />
        <meta name="theme-color" content="#1d293d" />
        <link rel="icon" href="/img/favicon.ico" />
      </head>
      <body className="bg-slate-100 h-full">
        {!doNotDisplayPrompt && <InstallPrompt />}
        {children}
      </body>
    </html>
  );
}
