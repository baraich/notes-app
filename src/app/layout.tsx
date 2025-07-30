import { Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const fontPoppins = Poppins({
  weight: "600",
  subsets: ["latin"],
  variable: "--poppins",
});

const fontDMSans = DM_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontPoppins.variable} ${fontDMSans.variable} antialiased w-full h-screen`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
