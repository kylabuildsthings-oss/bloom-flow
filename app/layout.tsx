import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { MedicalDisclaimerProvider } from "@/components/MedicalDisclaimer";
import { OpikProvider } from "@/lib/opik";
import { SoundToggle } from "@/components/SoundToggle";
import { OnboardingProvider } from "@/components/OnboardingProvider";

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: '--font-nunito',
  weight: ['300', '400', '500', '600', '700', '800'],
});

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
      <body className={`${nunito.variable} font-sans`}>
        <OpikProvider>
          <MedicalDisclaimerProvider>
            <OnboardingProvider>
              {children}
              <SoundToggle />
            </OnboardingProvider>
          </MedicalDisclaimerProvider>
        </OpikProvider>
      </body>
    </html>
  );
}
