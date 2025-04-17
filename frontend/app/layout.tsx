"use client";
import PrivyProviderWrapper from "@/components/PrivyProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TokenProvider } from "@/components/TokenContext";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/stories/BottomNav";
import { Navbar } from "@/stories/Navbar";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_INDEXER_URL,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_INDEXER_API_KEY}`
  }
});

//TODO I fought the law and the law won
// if (process.env.NODE_ENV !== "development") {
// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en" className="h-full dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="dark"
        >
          <PrivyProviderWrapper>
            <TokenProvider>
              <ApolloProvider client={client}>
                <div className="flex flex-col min-h-screen relative">
                  <Navbar />
                  <div className="flex-1 relative">{children}</div>
                  <div className="h-16 md:hidden">
                    {/* Spacer for bottom nav on mobile */}
                  </div>
                  <BottomNav currentPath={pathname} />
                </div>
                <Toaster />
              </ApolloProvider>
            </TokenProvider>
          </PrivyProviderWrapper>
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
