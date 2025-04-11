"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  User,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  HelpCircle,
  Clock,
  Search,
} from "lucide-react"
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
  icon: React.ElementType
}

export function ChatbotButton() {
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
  const [showButton, setShowButton] = useState(true)

  const suggestions: Suggestion[] = [
    { id: "1", text: "Tin tức mới nhất về thể thao?", icon: Clock },
    { id: "2", text: "Các sự kiện quan trọng hôm nay?", icon: Search },
    { id: "3", text: "Tìm kiếm bài viết về kinh tế?", icon: Search },
    { id: "4", text: "Cách đăng ký tài khoản Premium?", icon: HelpCircle },
  ]

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)

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

  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node) && isOpen) {
        // Don't close if clicking on the chat button
        const target = event.target as HTMLElement
        if (target.closest('[data-chat-button="true"]')) return

        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
    setShowButton(false)

    // Show button again after animation completes
    setTimeout(() => {
      setShowButton(true)
    }, 300)
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Button with animation */}
      {showButton && (
        <button
          onClick={toggleChat}
          data-chat-button="true"
          className={`bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center ${
            isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 hover:shadow-red-300/50 hover:shadow-lg"
          }`}
          aria-label="Mở trợ lý AI"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window with improved design */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 z-50 border border-gray-100 ${
            isMinimized ? "w-72 h-14" : "w-[350px] sm:w-[400px] h-[550px]"
          } animate-in fade-in slide-in-from-bottom-10 duration-300`}
          style={{
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Trợ lý AI</h3>
                <p className="text-xs text-white/70">Luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimize}
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Tabs */}
              <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 bg-gray-50 p-1 mx-4 mt-4 rounded-lg">
                  <TabsTrigger
                    value="chat"
                    className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm rounded-md py-2"
                  >
                    <span className="flex items-center">
                      <Bot className="h-4 w-4 mr-2" />
                      Chat
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="help"
                    className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm rounded-md py-2"
                  >
                    <span className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Trợ giúp
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="p-0 m-0 mt-4">
                  {/* Chat Messages */}
                  <ScrollArea className="h-[350px] px-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3.5 ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <div className="flex items-center mb-1">
                              {message.sender === "bot" ? (
                                <Bot className="h-4 w-4 mr-1.5" />
                              ) : (
                                <User className="h-4 w-4 mr-1.5" />
                              )}
                              <span className="text-xs font-medium">
                                {message.sender === "bot" ? "Trợ lý AI" : "Bạn"}
                              </span>
                            </div>

                            {message.isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  <div
                                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                  ></div>
                                </div>
                                <span className="text-sm">Đang soạn câu trả lời...</span>
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            )}

                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs opacity-75">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>

                              {message.sender === "bot" && !message.isLoading && (
                                <div className="flex space-x-1">
                                  <button className="text-xs opacity-75 hover:opacity-100 p-1 transition-opacity">
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button className="text-xs opacity-75 hover:opacity-100 p-1 transition-opacity">
                                    <ThumbsDown className="h-3.5 w-3.5" />
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
                    <div className="px-4 py-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">Gợi ý câu hỏi:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                            className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full transition-colors flex items-center"
                          >
                            <suggestion.icon className="h-3 w-3 mr-1.5" />
                            {suggestion.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chat Input */}
                  <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 flex items-center">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Nhập câu hỏi của bạn..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 mr-2 rounded-full border-gray-200 focus-visible:ring-red-500 py-5 px-4"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || isTyping}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full h-10 w-10 flex items-center justify-center"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="help" className="p-4 h-[420px] overflow-auto">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Trợ lý AI có thể giúp gì cho bạn?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start bg-gray-50 p-3 rounded-xl transition-all hover:bg-gray-100">
                      <div className="bg-red-100 text-red-600 p-2 rounded-full mr-3 mt-0.5">
                        <Search className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Tìm kiếm tin tức</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Tìm kiếm các bài viết theo chủ đề, từ khóa hoặc danh mục.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-xl transition-all hover:bg-gray-100">
                      <div className="bg-red-100 text-red-600 p-2 rounded-full mr-3 mt-0.5">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Tóm tắt tin tức</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Cung cấp tóm tắt ngắn gọn về các sự kiện quan trọng.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-xl transition-all hover:bg-gray-100">
                      <div className="bg-red-100 text-red-600 p-2 rounded-full mr-3 mt-0.5">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Hỗ trợ tài khoản</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Giải đáp thắc mắc về đăng ký, đăng nhập và quản lý tài khoản.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-xl transition-all hover:bg-gray-100">
                      <div className="bg-red-100 text-red-600 p-2 rounded-full mr-3 mt-0.5">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Gợi ý nội dung</p>
                        <p className="text-sm text-gray-600 mt-1">Đề xuất các bài viết phù hợp với sở thích của bạn.</p>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-4 w-4 text-red-500 mr-2" />
                      <p className="text-sm font-medium text-gray-800">Lưu ý:</p>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
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
    </div>
  )
}
