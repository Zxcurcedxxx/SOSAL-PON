"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Bot, User, Loader2, Paperclip, X, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/use-language"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
  files?: File[]
}

// Helper function to preserve newlines in text
function formatTextWithNewlines(text: string) {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < text.split("\n").length - 1 && <br />}
    </React.Fragment>
  ))
}

export function Chat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { language, translations } = useLanguage()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearChat = () => {
    setMessages([])
    setFiles([])
    setInput("")
  }

  const newChat = () => {
    // For now, this does the same as clearChat
    // In a more advanced implementation, this could save the current chat and start a new one
    clearChat()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && files.length === 0) return

    const userMessage: Message = {
      role: "user",
      content: input,
      files: files.length > 0 ? [...files] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setFiles([])
    setIsLoading(true)

    // Add a placeholder for the assistant's response
    const assistantPlaceholderId = Date.now().toString()
    setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantPlaceholderId } as any])

    try {
      // Create form data to handle files
      const formData = new FormData()
      formData.append("messages", JSON.stringify([...messages, userMessage]))

      if (userMessage.files) {
        userMessage.files.forEach((file) => {
          formData.append("files", file)
        })
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to fetch response")
      }

      const data = await response.json()

      // Update the assistant message with the response text
      setMessages((prev) =>
        prev.map((msg) =>
          (msg as any).id === assistantPlaceholderId
            ? { role: "assistant", content: data.text || data.answer || "No response received" }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          (msg as any).id === assistantPlaceholderId ? { role: "assistant", content: translations.errorMessage } : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{translations.chatWith} GPT-4o-mini</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={newChat}
            className="flex items-center gap-1 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border-gray-700"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            {translations.newChat}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="flex items-center gap-1 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border-gray-700"
            disabled={messages.length === 0 || isLoading}
          >
            <Trash2 className="h-4 w-4" />
            {translations.clearChat}
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden bg-gray-900 border-gray-800">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>{translations.startConversation}</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3",
                    message.role === "user"
                      ? "bg-gray-800 ml-12 border border-gray-700"
                      : "bg-gray-700 mr-12 border border-gray-600",
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {message.role === "user" ? (
                      <div className="bg-blue-600 p-1 rounded-full">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="bg-green-600 p-1 rounded-full">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium mb-1 text-gray-300">
                      {message.role === "user" ? translations.user : translations.assistant}
                    </p>
                    <div className="prose prose-sm max-w-none text-gray-100 whitespace-pre-wrap">
                      {message.content
                        ? formatTextWithNewlines(message.content)
                        : message.role === "assistant" && isLoading
                          ? "..."
                          : ""}
                    </div>

                    {/* Display file attachments for user messages */}
                    {message.files && message.files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-400">{translations.attachments}:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="bg-gray-600 rounded px-2 py-1 text-xs flex items-center text-gray-200"
                            >
                              <span className="truncate max-w-[150px]">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && !messages.some((m) => m.role === "assistant" && m.content === "") && (
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>{translations.thinking}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* File attachments display */}
          {files.length > 0 && (
            <div className="mt-2 mb-2">
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-full px-3 py-1 text-sm flex items-center gap-1 text-gray-200"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-gray-200">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">{translations.attachFiles}</span>
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={translations.typeMessage}
              disabled={isLoading}
              className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500"
            />
            <Button
              type="submit"
              disabled={isLoading || (!input.trim() && files.length === 0)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">{translations.send}</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
