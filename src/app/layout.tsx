import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BJJ Fund - Plataforma de Crowdfunding para Atletas de Jiu-Jitsu",
  description:
    "Conectamos atletas de jiu-jitsu com apoiadores que acreditam no potencial de cada guerreiro. Doe ou crie sua campanha!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ ESSA LINHA É CRUCIAL PARA EVITAR O ERRO
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col scroll-smooth antialiased`}
      >
        {/* Conteúdo principal */}
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
