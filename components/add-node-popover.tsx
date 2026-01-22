"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Search,
  Sparkles,
  Brain,
  Wrench,
  ImageIcon,
  Code,
  MessageSquare,
  Zap,
  GitBranch,
  Globe,
  Database,
  FileText,
  Mail,
  Calendar,
  Bot,
  Users,
  Webhook,
  Timer,
  Shield,
  Cpu,
  Network,
  Layers,
  X,
} from "lucide-react"

type NodeCategory = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  items: {
    type: string
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    isNew?: boolean
  }[]
}

const nodeCategories: NodeCategory[] = [
  {
    name: "New",
    icon: Sparkles,
    items: [
      {
        type: "httpRequest",
        name: "HTTP Request",
        description: "Make API calls to external services",
        icon: Globe,
        color: "from-blue-500 to-cyan-500",
        isNew: true,
      },
      {
        type: "conditional",
        name: "Conditional Logic",
        description: "Branch workflow based on conditions",
        icon: GitBranch,
        color: "from-purple-500 to-pink-500",
        isNew: true,
      },
      {
        type: "agent",
        name: "AI Agent",
        description: "Add an autonomous AI agent",
        icon: Bot,
        color: "from-emerald-500 to-teal-500",
        isNew: true,
      },
      {
        type: "webhook",
        name: "Webhook Trigger",
        description: "Trigger workflow via webhook",
        icon: Webhook,
        color: "from-orange-500 to-red-500",
        isNew: true,
      },
      {
        type: "contractAgent",
        name: "Contract Agent",
        description: "Specialized for Smart Contract interactions",
        icon: Search,
        color: "from-cyan-500 to-blue-600",
        isNew: true,
      },
    ],
  },
  {
    name: "AI & Intelligence",
    icon: Brain,
    items: [
      {
        type: "textModel",
        name: "Text Model",
        description: "Generate text with AI models",
        icon: Brain,
        color: "from-violet-500 to-purple-500",
      },
      {
        type: "embeddingModel",
        name: "Embedding Model",
        description: "Create vector embeddings",
        icon: Cpu,
        color: "from-cyan-500 to-blue-500",
      },
      {
        type: "structuredOutput",
        name: "Structured Output",
        description: "Parse AI responses into schema",
        icon: Layers,
        color: "from-emerald-500 to-teal-500",
      },
      {
        type: "ragRetrieval",
        name: "RAG Retrieval",
        description: "Retrieve context from vector store",
        icon: Database,
        color: "from-indigo-500 to-blue-500",
      },
      {
        type: "memoryStore",
        name: "Memory Store",
        description: "Store conversation memory",
        icon: Database,
        color: "from-pink-500 to-rose-500",
      },
    ],
  },
  {
    name: "Content",
    icon: MessageSquare,
    items: [
      {
        type: "prompt",
        name: "Prompt Template",
        description: "Create reusable prompt templates",
        icon: MessageSquare,
        color: "from-pink-500 to-rose-500",
      },
      {
        type: "imageGeneration",
        name: "Image Generation",
        description: "Generate images with AI",
        icon: ImageIcon,
        color: "from-amber-500 to-orange-500",
      },
      {
        type: "audio",
        name: "Audio Generation",
        description: "Generate speech from text",
        icon: Zap,
        color: "from-red-500 to-orange-500",
      },
      {
        type: "documentParser",
        name: "Document Parser",
        description: "Extract text from documents",
        icon: FileText,
        color: "from-blue-500 to-indigo-500",
      },
    ],
  },
  {
    name: "Integrations",
    icon: Network,
    items: [
      {
        type: "email",
        name: "Send Email",
        description: "Send emails via SMTP or API",
        icon: Mail,
        color: "from-blue-500 to-sky-500",
      },
      {
        type: "slack",
        name: "Slack Message",
        description: "Send messages to Slack",
        icon: MessageSquare,
        color: "from-purple-500 to-fuchsia-500",
      },
      {
        type: "calendar",
        name: "Calendar Event",
        description: "Create calendar events",
        icon: Calendar,
        color: "from-green-500 to-emerald-500",
      },
      {
        type: "database",
        name: "Database Query",
        description: "Query SQL/NoSQL databases",
        icon: Database,
        color: "from-slate-500 to-zinc-500",
      },
    ],
  },
  {
    name: "Logic & Tools",
    icon: Wrench,
    items: [
      {
        type: "javascript",
        name: "JavaScript",
        description: "Run custom JavaScript code",
        icon: Code,
        color: "from-yellow-500 to-amber-500",
      },
      {
        type: "tool",
        name: "Custom Tool",
        description: "Create a custom tool for agents",
        icon: Wrench,
        color: "from-slate-500 to-zinc-500",
      },
      {
        type: "delay",
        name: "Delay",
        description: "Wait for specified duration",
        icon: Timer,
        color: "from-gray-500 to-slate-500",
      },
      {
        type: "validator",
        name: "Data Validator",
        description: "Validate and sanitize data",
        icon: Shield,
        color: "from-green-500 to-emerald-500",
      },
      {
        type: "humanInLoop",
        name: "Human in Loop",
        description: "Require human approval",
        icon: Users,
        color: "from-violet-500 to-purple-500",
      },
    ],
  },
  {
    name: "Blockchain",
    icon: Network,
    items: [
      {
        type: "contractAgent",
        name: "Contract Agent",
        description: "Interact with any smart contract on-chain",
        icon: Search,
        color: "from-cyan-400 to-cyan-600",
      },
      {
        type: "wallet",
        name: "Wallet Connection",
        description: "Manage and connect user wallets",
        icon: Shield,
        color: "from-orange-400 to-orange-600",
      },
    ],
  },
]

type AddNodePopoverProps = {
  onAddNode: (type: string) => void
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLElement | null>
  position?: { x: number; y: number } | null
  sourceNodeId?: string | null
}

export function AddNodePopover({
  onAddNode,
  isOpen,
  onClose,
  triggerRef,
  position,
  sourceNodeId,
}: AddNodePopoverProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isOpen) return

    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const x = Math.min(rect.right + 12, window.innerWidth - 360)
      const y = Math.max(rect.top - 100, 80)
      setPopoverPos({ x, y: Math.min(y, window.innerHeight - 450) })
    } else if (position) {
      const x = Math.min(position.x, window.innerWidth - 360)
      const y = Math.max(position.y, 80)
      setPopoverPos({ x, y: Math.min(y, window.innerHeight - 450) })
    } else {
      setPopoverPos({ x: window.innerWidth / 2 - 160, y: 150 })
    }
  }, [isOpen, triggerRef, position])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
    if (!isOpen) {
      setSearchQuery("")
      setHoveredItem(null)
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

  const filteredCategories = nodeCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  const hoveredNodeItem = hoveredItem
    ? nodeCategories.flatMap((c) => c.items).find((item) => item.type === hoveredItem)
    : null

  return (
    <div
      ref={popoverRef}
      className="fixed z-[9999] flex gap-2 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: popoverPos.x,
        top: popoverPos.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-80 overflow-hidden rounded-xl border border-white/10 bg-[#151520]/98 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-foreground">Add Tile</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {sourceNodeId ? "Select a node to connect" : "Add a new node to your workflow"}
          </p>
        </div>

        {/* Search */}
        <div className="border-b border-white/5 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-violet-500/30 bg-violet-500/5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* Node List */}
        <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {filteredCategories.map((category) => (
            <div key={category.name} className="mb-3">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-medium text-muted-foreground">
                  {category.name} <span className="text-muted-foreground/50">({category.items.length})</span>
                </span>
              </div>
              <div className="space-y-0.5">
                {category.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.type}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddNode(item.type)
                        onClose()
                        setSearchQuery("")
                      }}
                      onMouseEnter={() => setHoveredItem(item.type)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-all hover:bg-white/5"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{item.name}</span>
                          {item.isNew && (
                            <span className="rounded bg-violet-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                              New
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No tiles found</div>
          )}
        </div>
      </div>

      {/* Detail Panel on Hover */}
      {hoveredNodeItem && (
        <div className="w-64 overflow-hidden rounded-xl border border-white/10 bg-[#151520]/98 shadow-2xl backdrop-blur-xl animate-in fade-in-0 slide-in-from-left-2 duration-150">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${hoveredNodeItem.color}`}
              >
                <hoveredNodeItem.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{hoveredNodeItem.name}</h3>
                {hoveredNodeItem.isNew && <span className="text-[10px] text-violet-400">NEW</span>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{hoveredNodeItem.description}</p>
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-xs text-muted-foreground/70">
                <span className="text-violet-400">Features:</span> Drag & drop, auto-connect, configurable parameters
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
