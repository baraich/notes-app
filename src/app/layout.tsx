import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const fontSpaceGrotesk = Space_Grotesk({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--space-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSpaceGrotesk.variable} antialiased w-full h-screen`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
