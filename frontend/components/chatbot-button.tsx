import { MessageSquare } from "lucide-react"

export function ChatbotButton() {
  return (
    <div className="relative group">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Mở trợ lý AI"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap">Trợ lý AI</div>
      </div>
    </div>
  )
}
