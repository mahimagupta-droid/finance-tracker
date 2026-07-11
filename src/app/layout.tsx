import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "../components/miscellaneous/navbar";
import { Toaster } from "@/components/ui/sonner";
import { Lato, Lexend, Playfair_Display } from "next/font/google";
import Footer from "@/components/ui/footer";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: "--font-playfair",
})

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "finsightai",
  description: "Track expenses, set budgets, and get AI-powered financial insights with FinSight AI — a personal finance platform that helps you save smarter, detect spending patterns, and plan your financial future.",
  icons: {
    icon: '/project-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className={`${lato.variable} ${lexend.variable} ${playfair.variable} bg-background text-textColor w-full antialiased min-h-screen flex flex-col mt-0`}>
          <ClerkProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <Navbar />
              <div className="flex flex-col flex-1 justify-center items-center bg-background text-textColor w-full transition-colors duration-300 top-0">
                <Toaster />
                {children}
              </div>
              <div className="w-full">
                <Footer />
              </div>
            </ThemeProvider>
          </ClerkProvider>
        </main>
      </body>
    </html>
  );
}
