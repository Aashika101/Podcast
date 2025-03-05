import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PodPulse",
  description: "Generated podcast using AI",
  icons: {
    icon: '/icons/logos.svg'
  }
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <AudioProvider>
           <body className={`${manrope.className}`}>
              {children}
          </body> 
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}

export default RootLayout;