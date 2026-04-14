import type { Metadata } from "next";
import {  Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/app/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ProfileProvider } from "@/context/Profile";
const notoSansHeading = Noto_Sans({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export const metadata: Metadata = {
  title: "FinFlow",
  description: "Personal Finance Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable, notoSansHeading.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ProfileProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-center" />
            </ThemeProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
