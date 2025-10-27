import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexClientProvider } from "./ConvexClientProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "e-Auction",
    description: "e-Auction, a melhor plataforma de leilões online!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="pt-BR" suppressHydrationWarning>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <ConvexClientProvider>
                            {children}
                            <Toaster richColors />
                        </ConvexClientProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
