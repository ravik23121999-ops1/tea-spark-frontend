import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Providers } from "@/redux/Providers";
import { Toaster } from "react-hot-toast";
import ChatBot from "@/components/Chat/ChatBot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Tea Spark | Artisanal Home-Baked Goodness",
  description: "Experience the magic of home-baked pastries, bread, and treats. Handcrafted with love at Tea Spark Bakery.",
  keywords: ["bakery", "home-baked", "pastries", "artisanal bread", "Tea Spark"],
  icons: {
    icon: "/tea-spark-logo.svg",
    shortcut: "/tea-spark-logo.svg",
    apple: "/tea-spark-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>
          <ThemeProvider>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
            <ChatBot />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
