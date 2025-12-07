import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google"
import "./globals.css";
import { twMerge } from "tailwind-merge";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const calistoga = Calistoga({ subsets: ['latin'], variable: '--font-sarif', weight: ['400'], })

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Personal portfolio and blog by the author.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={twMerge(inter.variable, calistoga.variable, "bg-gray-900 text-white antialiased font-sans")}>{children}<Footer /></body>
    </html>
  );
}
