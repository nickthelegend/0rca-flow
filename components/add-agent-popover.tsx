"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Bot, X, Sparkles } from "lucide-react"
import Image from "next/image"

interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  category: string
  createdAt: string
}

type AddAgentPopoverProps = {
  isOpen: boolean
  onClose: () => void
  onAddAgent: (agent: Agent) => void
}

export function AddAgentPopover({ isOpen, onClose, onAddAgent }: AddAgentPopoverProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [agents, setAgents] = useState<Agent[]>([])
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      // Load agents from localStorage
      const loadedAgents: Agent[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("agent-")) {
          const data = localStorage.getItem(key)
          if (data) {
            loadedAgents.push(JSON.parse(data))
          }
        }
      }
      setAgents(loadedAgents)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Research":
        return "from-blue-500 to-cyan-500"
      case "Content":
        return "from-violet-500 to-purple-500"
      case "Data":
        return "from-green-500 to-emerald-500"
      case "Customer":
        return "from-orange-500 to-amber-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div
        ref={popoverRef}
        className="w-[500px] max-h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-[#151520]/95 shadow-2xl shadow-black/50 backdrop-blur-xl animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="border-b border-white/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Add Agent to Workflow</h2>
                <p className="text-xs text-muted-foreground">Select an agent to add to your workflow</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-white/5 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* Agent List */}
        <div className="max-h-[400px] overflow-y-auto p-4">
          {filteredAgents.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto mb-4 flex items-center justify-center">
                <Bot className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-base font-medium mb-2 text-white/80">No agents found</h3>
              <p className="text-sm text-white/50 mb-4">Create agents first to add them to workflows</p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 text-sm hover:bg-violet-500/30 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Create Agent
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => onAddAgent(agent)}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 rounded-xl p-4 text-left transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(agent.category)} flex items-center justify-center overflow-hidden`}
                    >
                      {agent.avatar ? (
                        <Image
                          src={agent.avatar || "/placeholder.svg"}
                          alt={agent.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Bot className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{agent.name}</h3>
                      <span className="text-xs text-muted-foreground">{agent.category || "General"}</span>
                    </div>
                  </div>
                  {agent.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{agent.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
