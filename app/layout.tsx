import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "./providers/ConvexClerkProvider";
import CreatePodcast from "./(root)/create-podcast/page";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <ConvexClerkProvider>
          {children}
        </ConvexClerkProvider>
      </body>
    </html>
  );
}

export default RootLayout;