import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Time To Upload YouTube Videos | VideoIQ",
  description: "Analyze any YouTube video and discover the best upload times, engagement patterns, and growth opportunities using AI.",
  keywords: [
    "best upload time youtube",
    "youtube upload time checker",
    "youtube analytics ai",
    "youtube timing analyzer",
    "best time to post youtube videos",
    "youtube seo tool",
    "youtube growth tool",
    "youtube creator analytics",
    "video upload analyzer",
    "youtube performance checker",
  ],
  authors: [{ name: "VideoIQ" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Best Time To Upload YouTube Videos | VideoIQ",
    description: "Analyze any YouTube video and discover the best upload times, engagement patterns, and growth opportunities using AI.",
    type: "website",
    siteName: "VideoIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Time To Upload YouTube Videos | VideoIQ",
    description: "Analyze any YouTube video and discover the best upload times, engagement patterns, and growth opportunities using AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
