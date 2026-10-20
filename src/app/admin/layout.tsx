import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "SideQuest Day admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-bg antialiased">
        <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>
      </body>
    </html>
  );
}
