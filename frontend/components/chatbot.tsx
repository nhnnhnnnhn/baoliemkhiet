"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Minimize2, Maximize2, User, Sparkles, Loader2, ThumbsUp, ThumbsDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isLoading?: boolean
}

type Suggestion = {
  id: string
  text: string
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
  const [activeTab, setActiveTab] = useState("chat")
  const [isTyping, setIsTyping] = useState(false)

  const suggestions: Suggestion[] = [
    { id: "1", text: "Tin tức mới nhất về thể thao?" },
    { id: "2", text: "Các sự kiện quan trọng hôm nay?" },
    { id: "3", text: "Tìm kiếm bài viết về kinh tế?" },
    { id: "4", text: "Cách đăng ký tài khoản Premium?" },
  ]

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

    // Add loading message
    const loadingId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        content: "",
        sender: "bot",
        timestamp: new Date(),
        isLoading: true,
      },
    ])

    setInput("")
    setIsTyping(true)

    // Simulate bot response after a short delay
    setTimeout(() => {
      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingId))

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
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    // Auto submit after a short delay
    setTimeout(() => {
      handleSubmit(new Event("submit") as unknown as React.FormEvent)
    }, 100)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Mở trợ lý AI"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-6 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 z-50 border border-gray-200 ${
            isMinimized ? "w-72 h-14" : "w-80 sm:w-96 h-[500px]"
          }`}
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
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
              {/* Tabs */}
              <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 bg-gray-100">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-white">
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="help" className="data-[state=active]:bg-white">
                    Trợ giúp
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="p-0 m-0">
                  {/* Chat Messages */}
                  <ScrollArea className="h-[350px] p-4">
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
                              <span className="text-xs opacity-75">
                                {message.sender === "bot" ? "Trợ lý AI" : "Bạn"}
                              </span>
                            </div>

                            {message.isLoading ? (
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Đang soạn câu trả lời...</span>
                              </div>
                            ) : (
                              <p>{message.content}</p>
                            )}

                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs opacity-75">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>

                              {message.sender === "bot" && !message.isLoading && (
                                <div className="flex space-x-1">
                                  <button className="text-xs opacity-75 hover:opacity-100 p-1">
                                    <ThumbsUp className="h-3 w-3" />
                                  </button>
                                  <button className="text-xs opacity-75 hover:opacity-100 p-1">
                                    <ThumbsDown className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Suggestions */}
                  {messages.length < 3 && (
                    <div className="px-4 py-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Gợi ý:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full transition-colors"
                          >
                            {suggestion.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                    <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="help" className="p-4 h-[400px] overflow-auto">
                  <h3 className="font-bold text-lg mb-3">Trợ lý AI có thể giúp gì cho bạn?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 mt-0.5">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Tìm kiếm tin tức</p>
                        <p className="text-sm text-gray-600">
                          Tìm kiếm các bài viết theo chủ đề, từ khóa hoặc danh mục.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 mt-0.5">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Tóm tắt tin tức</p>
                        <p className="text-sm text-gray-600">Cung cấp tóm tắt ngắn gọn về các sự kiện quan trọng.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 mt-0.5">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Hỗ trợ tài khoản</p>
                        <p className="text-sm text-gray-600">
                          Giải đáp thắc mắc về đăng ký, đăng nhập và quản lý tài khoản.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 mt-0.5">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Gợi ý nội dung</p>
                        <p className="text-sm text-gray-600">Đề xuất các bài viết phù hợp với sở thích của bạn.</p>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium mb-2">Lưu ý:</p>
                    <p className="text-xs text-gray-600">
                      Trợ lý AI đang trong giai đoạn phát triển và có thể không trả lời chính xác mọi câu hỏi. Chúng tôi
                      liên tục cải thiện để mang đến trải nghiệm tốt nhất cho bạn.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
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
