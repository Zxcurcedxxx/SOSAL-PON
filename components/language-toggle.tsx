"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export function LanguageToggle() {
  const { language, toggleLanguage, translations } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border-gray-700"
    >
      {language === "en" ? "RU" : "EN"}
    </Button>
  )
}
