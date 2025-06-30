// src/app/layout.tsx
import { ThemeProvider } from "@/components/themes/ThemeProvider"
import { Toaster } from "@/components/ui/toast"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { AuthProvider } from "@/providers/AuthProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { themes } from "@/lib/themes"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Maker",
  description: "Create and explore AI prompts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <AuthProvider>
          <ThemeProvider initialTheme={themes.japaneseMinimal}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
