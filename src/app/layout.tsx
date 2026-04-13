// src/app/layout.tsx
import { Toaster } from "@/components/ui/toast"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { AuthProvider } from "@/providers/AuthProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Prompt Maker — Consultoría de Software, Producto e IA",
    template: "%s | Prompt Maker",
  },
  description:
    "Consultoría de software y producto para negocios que quieren escalar. Desarrollo a medida, web agency automatizada con IA, prompt engineering y más.",
  keywords: [
    "consultoría de software",
    "desarrollo de producto",
    "prompt engineering",
    "web agency IA",
    "agentes de IA",
    "desarrollo web",
    "identidad visual IA",
  ],
  authors: [{ name: "Prompt Maker" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Prompt Maker",
    title: "Prompt Maker — Consultoría de Software, Producto e IA",
    description:
      "De la idea al producto. Consultoría de software, desarrollo a medida y web agency automatizada con inteligencia artificial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Maker — Consultoría de Software, Producto e IA",
    description:
      "De la idea al producto. Consultoría de software y producto para negocios que quieren escalar.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
