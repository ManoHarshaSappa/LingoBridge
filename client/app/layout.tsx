import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LingoBridge — Real-time Multilingual Chat",
  description: "Chat across languages in real-time. No sign-up needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
