import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FraudShield AI | Enterprise Fraud Detection",
  description: "AI-Powered Digital Payment Fraud Detection & Transaction Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={cn(inter.className, "min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500/30")}>
        {children}
      </body>
    </html>
  );
}
