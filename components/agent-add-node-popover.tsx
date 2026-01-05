"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X, Sparkles, Bot, FileText, Wrench, Brain, BookOpen, Shield, FileOutput } from "lucide-react"

interface AgentAddNodePopoverProps {
  isOpen: boolean
  onAddNode: (type: string, sourceNodeId?: string) => void
  onClose: () => void
  position?: { x: number; y: number } | null
  triggerRef?: React.RefObject<HTMLButtonElement | null>
  sourceNodeId?: string
}

const agentNodeCategories = [
  {
    name: "Core",
    icon: Sparkles,
    items: [
      {
        type: "agentCore",
        name: "Agent Core",
        description: "The central brain of your agent",
        icon: Bot,
        color: "from-emerald-500 to-teal-500",
        isNew: true,
      },
    ],
  },
  {
    name: "Configuration",
    icon: Wrench,
    items: [
      {
        type: "systemPrompt",
        name: "System Prompt",
        description: "Define agent instructions",
        icon: FileText,
        color: "from-blue-500 to-indigo-500",
      },
      {
        type: "toolsConfig",
        name: "Tools Config",
        description: "Configure agent capabilities",
        icon: Wrench,
        color: "from-orange-500 to-amber-500",
      },
      {
        type: "memory",
        name: "Memory",
        description: "Conversation history management",
        icon: Brain,
        color: "from-purple-500 to-pink-500",
      },
    ],
  },
  {
    name: "Enhancement",
    icon: BookOpen,
    items: [
      {
        type: "knowledgeBase",
        name: "Knowledge Base",
        description: "RAG and document retrieval",
        icon: BookOpen,
        color: "from-cyan-500 to-blue-500",
        isNew: true,
      },
      {
        type: "guardrails",
        name: "Guardrails",
        description: "Safety and content filters",
        icon: Shield,
        color: "from-red-500 to-rose-500",
      },
      {
        type: "outputParser",
        name: "Output Parser",
        description: "Format agent responses",
        icon: FileOutput,
        color: "from-yellow-500 to-orange-500",
      },
    ],
  },
]

export function AgentAddNodePopover({
  isOpen,
  onAddNode,
  onClose,
  position,
  triggerRef,
  sourceNodeId,
}: AgentAddNodePopoverProps) {
  const [search, setSearch] = useState("")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  useEffect(() => {
    if (isOpen) {
      if (triggerRef?.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        // Position to the right of the trigger button
        setPopoverPosition({
          top: Math.max(80, rect.top - 50),
          left: rect.right + 12,
        })
      } else if (position) {
        // Use provided position (from right-click context menu)
        setPopoverPosition({
          top: Math.min(position.y, window.innerHeight - 500),
          left: Math.min(position.x, window.innerWidth - 400),
        })
      } else {
        // Fallback to center
        setPopoverPosition({
          top: window.innerHeight / 2 - 200,
          left: window.innerWidth / 2 - 160,
        })
      }
    }
  }, [isOpen, position, triggerRef])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        // Don't close if clicking the trigger button
        if (triggerRef?.current?.contains(e.target as Node)) return
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  const filteredCategories = agentNodeCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  const hoveredItemData = agentNodeCategories.flatMap((c) => c.items).find((item) => item.type === hoveredItem)

  const handleAddNode = (type: string) => {
    onAddNode(type, sourceNodeId)
    onClose()
  }

  return (
    <div
      ref={popoverRef}
      className="fixed z-[9999] flex animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        top: popoverPosition.top,
        left: popoverPosition.left,
      }}
    >
      {/* Main Popover */}
      <div className="w-[320px] bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                Add Component
              </h3>
              <p className="text-xs text-white/50 mt-0.5">Build your AI agent</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              autoFocus
            />
          </div>
        </div>

        {/* Categories */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredCategories.map((category) => (
            <div key={category.name} className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-white/40">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{category.name}</span>
                <span className="text-white/20">({category.items.length})</span>
              </div>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleAddNode(item.type)}
                    onMouseEnter={() => setHoveredItem(item.type)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{item.name}</span>
                        {item.isNew && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-white/40 text-xs truncate block">{item.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Detail Panel */}
      {hoveredItemData && (
        <div className="w-[240px] ml-2 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in-0 slide-in-from-left-2 duration-200">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hoveredItemData.color} flex items-center justify-center mb-3`}
          >
            <hoveredItemData.icon className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
            {hoveredItemData.name}
            {hoveredItemData.isNew && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">NEW</span>
            )}
          </h4>
          <p className="text-white/60 text-sm mb-3">{hoveredItemData.description}</p>
          <div className="text-xs text-white/40">
            <span className="font-semibold text-white/60">Features:</span> Drag & drop, auto-connect, configurable
            parameters
          </div>
        </div>
      )}
    </div>
  )
}
