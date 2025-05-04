"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "ru"

type Translations = {
  chatWith: string
  newChat: string
  clearChat: string
  startConversation: string
  user: string
  assistant: string
  attachments: string
  thinking: string
  attachFiles: string
  typeMessage: string
  send: string
  errorMessage: string
  aiChat: string
  chatWithAI: string
  language: string
  english: string
  russian: string
  theme: string
  light: string
  dark: string
  system: string
}

const translations: Record<Language, Translations> = {
  en: {
    chatWith: "Chat with",
    newChat: "New Chat",
    clearChat: "Clear Chat",
    startConversation: "Start a conversation by sending a message",
    user: "User",
    assistant: "Assistant",
    attachments: "Attachments",
    thinking: "AI is thinking... (this may take a moment)",
    attachFiles: "Attach files",
    typeMessage: "Type your message...",
    send: "Send",
    errorMessage: "Sorry, there was an error processing your request.",
    aiChat: "AI Chat",
    chatWithAI: "Chat with AI powered by GPT-4o-mini",
    language: "Language",
    english: "English",
    russian: "Russian",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  ru: {
    chatWith: "Чат с",
    newChat: "Новый чат",
    clearChat: "Очистить чат",
    startConversation: "Начните разговор, отправив сообщение",
    user: "Пользователь",
    assistant: "Ассистент",
    attachments: "Вложения",
    thinking: "ИИ думает... (это может занять некоторое время)",
    attachFiles: "Прикрепить файлы",
    typeMessage: "Введите ваше сообщение...",
    send: "Отправить",
    errorMessage: "Извините, произошла ошибка при обработке вашего запроса.",
    aiChat: "ИИ Чат",
    chatWithAI: "Общайтесь с ИИ на базе GPT-4o-mini",
    language: "Язык",
    english: "Английский",
    russian: "Русский",
    theme: "Тема",
    light: "Светлая",
    dark: "Темная",
    system: "Системная",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  translations: Translations
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ru" : "en"))
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: translations[language],
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
