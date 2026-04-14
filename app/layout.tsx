import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetOS",
  description: "Meeting operations dashboard for Legal Capital"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-semibold">
              MeetOS
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/book">Book</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/display">Display</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
