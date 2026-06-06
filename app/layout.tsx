import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Сансар гар утас худалдаа",
  description:
    "Шинэ ба хуучин гар утас. Storepay, M Credit-ээр хүүгүй хуваан төлөлт. Сансар гар утас худалдаа.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
