import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

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
    <TRPCReactProvider>
      <html lang="en" className="dark">
        <body
          className={`${fontSpaceGrotesk.variable} antialiased w-full h-screen`}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </TRPCReactProvider>
  );
}
