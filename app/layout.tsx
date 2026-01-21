import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MedicalDisclaimerProvider } from "@/components/MedicalDisclaimer";
import { OpikProvider } from "@/lib/opik";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BloomFlow - Your Health Journey",
  description: "A HIPAA-inspired health tracking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OpikProvider>
          <MedicalDisclaimerProvider>
            {children}
          </MedicalDisclaimerProvider>
        </OpikProvider>
      </body>
    </html>
  );
}
