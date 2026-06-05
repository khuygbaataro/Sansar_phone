import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Сансар гар утас худалдаа",
  description:
    "Шинэ ба хуучин гар утас. Storepay, M Credit-ээр хүүгүй хуваан төлөлт. Сансар гар утас худалдаа.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  return (
    <html lang="mn" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-background text-foreground">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
