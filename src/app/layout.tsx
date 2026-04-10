import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinDash Pro - Gestão Financeira Inteligente",
  description: "Sistema completo de gestão financeira pessoal com controle de cartões, transações e analytics. Dashboard premium com dark mode.",
  keywords: ["FinDash", "finanças", "gestão financeira", "cartões de crédito", "dashboard", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "FinDash Pro Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "FinDash Pro - Gestão Financeira Inteligente",
    description: "Controle suas finanças com estilo e eficiência",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
