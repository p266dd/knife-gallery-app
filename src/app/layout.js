import "./globals.css";

export const metadata = {
  title: "Knife Gallery App",
  description: "Created using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
