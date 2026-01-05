"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bot, X, Send, Loader2, Sparkles, ChevronRight, Minimize2, Maximize2 } from "lucide-react"
import { sendMessageToAI } from "@/app/actions"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI workflow assistant. I can help you create nodes, explain concepts, or answer questions about your workflow. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isCollapsed && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isCollapsed])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendMessageToAI(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) setIsCollapsed(false)
        }}
        size="sm"
        className="relative h-8 gap-2 rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-purple-500/10 text-xs text-foreground shadow-lg shadow-violet-500/10 transition-all hover:border-violet-500/50 hover:from-violet-500/20 hover:to-purple-500/20 hover:shadow-violet-500/20"
      >
        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
        AI Assistant
        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
          </span>
        )}
      </Button>

      {/* Sidebar Panel */}
      {isOpen && (
        <div
          className={`fixed top-0 right-0 z-50 h-full transform transition-all duration-300 ease-out ${
            isCollapsed ? "w-16" : "w-[400px]"
          }`}
        >
          <div className="flex h-full flex-col border-l border-violet-500/20 bg-[#0a0a0f] shadow-2xl shadow-violet-500/10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-4 py-4">
              {!isCollapsed ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">AI Assistant</h2>
                      <p className="text-xs text-muted-foreground">Powered by GPT-4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsCollapsed(true)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      title="Collapse"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      title="Close"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex w-full flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(false)}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    title="Expand"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Collapsed state - just show expand button */}
            {isCollapsed ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-2">
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400 transition-all hover:bg-violet-500/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="text-xs text-muted-foreground" style={{ writingMode: "vertical-rl" }}>
                  Expand Chat
                </span>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20"
                            : "border border-white/10 bg-card/80 text-foreground shadow-lg"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`mt-1 text-xs ${message.role === "user" ? "text-violet-200" : "text-muted-foreground"}`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl border border-white/10 bg-card/80 px-4 py-3 shadow-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                          <span>AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-white/5 bg-gradient-to-r from-violet-500/5 to-purple-500/5 p-4">
                  <div className="flex gap-3">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      disabled={isLoading}
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-white/10 bg-card/50 px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:border-violet-500/50 focus:bg-card/80 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                      style={{ minHeight: "44px", maxHeight: "120px" }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = "44px"
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`
                      }}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-violet-500/40 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
