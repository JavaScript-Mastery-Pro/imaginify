/* eslint-disable camelcase */
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import { cn } from "@/lib/utils";
import "./globals.css";

const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-imb-plex",
});

export const metadata: Metadata = {
  title: "Imaginify",
  description:
    "Transform your images effortlessly with cutting-edge AI enhancements, powered by Cloudinary for a seamless and intuitive editing experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#624cf5" },
      }}
    >
      <html lang="en">
        <body className={cn("font-IMBPlex antialiased", IBMPlex.variable)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
