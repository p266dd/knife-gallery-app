import { Open_Sans } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100">{children}</body>
    </html>
  );
}
