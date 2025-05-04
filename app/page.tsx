"use client"

import { Chat } from "@/components/chat"
import { useLanguage } from "@/hooks/use-language"

export default function Home() {
  const { translations } = useLanguage()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-900">
      <div className="z-10 w-full max-w-5xl">
        <h1 className="mb-4 text-4xl font-bold text-center text-white">{translations.aiChat}</h1>
        <p className="mb-8 text-center text-gray-400">{translations.chatWithAI}</p>
        <Chat />
      </div>
    </main>
  )
}
