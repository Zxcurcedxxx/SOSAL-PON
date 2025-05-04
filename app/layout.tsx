import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/use-language"
import { LanguageToggle } from "@/components/language-toggle"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Chat - GPT-4o-mini",
  description: "Chat with GPT-4o-mini",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
            <div className="min-h-screen bg-background flex flex-col dark">
              <header className="border-b border-gray-800">
                <div className="container flex h-16 items-center justify-between">
                  <div className="font-bold text-xl text-white">AI Chat - GPT-4o-mini</div>
                  <div className="flex items-center gap-2">
                    <LanguageToggle />
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
