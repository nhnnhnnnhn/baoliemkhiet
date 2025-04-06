"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Minimize2, Maximize2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Xin chào! Tôi là trợ lý AI của Báo Liêm Khiết. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "Cảm ơn câu hỏi của bạn. Tôi có thể giúp bạn tìm kiếm tin tức mới nhất về chủ đề này.",
        "Đây là một chủ đề thú vị. Bạn có thể tìm thấy nhiều bài viết liên quan trong mục Thời sự của chúng tôi.",
        "Tôi hiểu câu hỏi của bạn. Để biết thêm chi tiết, bạn có thể đọc các bài phân tích chuyên sâu trong mục Ý kiến.",
        "Đó là một câu hỏi hay. Tôi đề xuất bạn xem thêm các bài viết mới nhất của chúng tôi về vấn đề này.",
        "Tôi đang tìm kiếm thông tin cho bạn. Bạn có thể quan tâm đến loạt bài viết đặc biệt của chúng tôi về chủ đề này.",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-6 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 z-50 ${
            isMinimized ? "w-72 h-14" : "w-80 sm:w-96 h-[500px]"
          }`}
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Trợ lý AI</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimize}
                className="h-7 w-7 text-white hover:bg-blue-700 rounded-full"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-7 w-7 text-white hover:bg-blue-700 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {message.sender === "bot" ? (
                            <Bot className="h-4 w-4 mr-1" />
                          ) : (
                            <User className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-xs opacity-75">{message.sender === "bot" ? "Trợ lý AI" : "Bạn"}</span>
                        </div>
                        <p>{message.content}</p>
                        <div className="text-right mt-1">
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="border-t p-3 flex">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Nhập câu hỏi của bạn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 mr-2"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}

export function ChatbotButton() {
  return (
    <div className="relative group">
      <Chatbot />
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap">Trợ lý AI</div>
      </div>
    </div>
  )
}

