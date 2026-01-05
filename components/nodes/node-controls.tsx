"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Plus, Play, ChevronRight, MoreVertical, Copy, Trash2, GripVertical, Search, X, Sparkles } from "lucide-react"

const nodeCategories = [
  {
    name: "New",
    items: [
      {
        type: "httpRequest",
        name: "HTTP Request",
        description: "Make API calls",
        color: "from-blue-500 to-cyan-500",
        isNew: true,
      },
      {
        type: "conditional",
        name: "Conditional Logic",
        description: "Branch workflow",
        color: "from-purple-500 to-pink-500",
        isNew: true,
      },
      {
        type: "agent",
        name: "AI Agent",
        description: "Add autonomous agent",
        color: "from-emerald-500 to-teal-500",
        isNew: true,
      },
    ],
  },
  {
    name: "AI & Intelligence",
    items: [
      {
        type: "textModel",
        name: "Text Model",
        description: "Generate text with AI",
        color: "from-violet-500 to-purple-500",
      },
      {
        type: "embeddingModel",
        name: "Embedding Model",
        description: "Create embeddings",
        color: "from-cyan-500 to-blue-500",
      },
      {
        type: "structuredOutput",
        name: "Structured Output",
        description: "Parse AI responses",
        color: "from-emerald-500 to-teal-500",
      },
    ],
  },
  {
    name: "Content",
    items: [
      { type: "prompt", name: "Prompt Template", description: "Create prompts", color: "from-pink-500 to-rose-500" },
      {
        type: "imageGeneration",
        name: "Image Generation",
        description: "Generate images",
        color: "from-amber-500 to-orange-500",
      },
      { type: "audio", name: "Audio Generation", description: "Generate speech", color: "from-red-500 to-orange-500" },
    ],
  },
  {
    name: "Logic & Tools",
    items: [
      { type: "javascript", name: "JavaScript", description: "Run custom code", color: "from-yellow-500 to-amber-500" },
      { type: "tool", name: "Custom Tool", description: "Create a tool", color: "from-slate-500 to-zinc-500" },
      { type: "end", name: "End", description: "End the workflow", color: "from-red-500 to-rose-500" },
    ],
  },
]

type NodeControlsProps = {
  nodeId: string
  nodeName: string
  nodeDescription: string
  nodeIcon: React.ReactNode
  nodeColor: string
  selected?: boolean
  isHovered: boolean
  hasOutgoingConnection?: boolean
  onAddNode?: (type: string, sourceNodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onDuplicateNode?: (nodeId: string) => void
  onCopyNode?: (nodeId: string) => void
}

export function NodeControls({
  nodeId,
  nodeName,
  nodeDescription,
  nodeIcon,
  nodeColor,
  selected,
  isHovered,
  hasOutgoingConnection,
  onAddNode,
  onDeleteNode,
  onDuplicateNode,
  onCopyNode,
}: NodeControlsProps) {
  const [showAddPopover, setShowAddPopover] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 })
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (addButtonRef.current) {
      const rect = addButtonRef.current.getBoundingClientRect()
      setPopoverPos({
        x: rect.right + 12,
        y: Math.max(rect.top - 50, 80),
      })
    }
    setShowAddPopover(true)
  }

  // Focus search when popover opens
  useEffect(() => {
    if (showAddPopover && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
    if (!showAddPopover) {
      setSearchQuery("")
    }
  }, [showAddPopover])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        addButtonRef.current &&
        !addButtonRef.current.contains(e.target as Node)
      ) {
        setShowAddPopover(false)
      }
    }
    if (showAddPopover) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showAddPopover])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddPopover(false)
        setShowContextMenu(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const filteredCategories = nodeCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0)

  return (
    <>
      {/* Floating Toolbar */}
      {selected && (
        <div className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#1a1a25]/95 px-2 py-1.5 shadow-xl backdrop-blur-xl">
            <button className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
              <Play className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
              <div className="flex items-center">
                <Play className="h-3 w-3" />
                <ChevronRight className="-ml-1 h-3 w-3" />
              </div>
            </button>
            <div className="mx-1 h-4 w-px bg-white/10" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowContextMenu(!showContextMenu)
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Context Menu */}
          {showContextMenu && (
            <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-[100]">
              <div className="min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-[#1a1a25]/98 py-1 shadow-xl backdrop-blur-xl">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCopyNode?.(nodeId)
                    setShowContextMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  Copy to clipboard
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicateNode?.(nodeId)
                    setShowContextMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  Duplicate
                </button>
                <div className="my-1 h-px bg-white/10" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteNode?.(nodeId)
                    setShowContextMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hover Tooltip */}
      {isHovered && !selected && (
        <div className="absolute -top-14 left-1/2 z-40 -translate-x-1/2 animate-in fade-in-0 duration-150 pointer-events-none">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a25]/95 px-3 py-2 shadow-lg backdrop-blur-xl whitespace-nowrap">
            <div className={`flex h-6 w-6 items-center justify-center rounded ${nodeColor}`}>{nodeIcon}</div>
            <div>
              <p className="text-xs font-medium text-foreground">{nodeName}</p>
              <p className="text-[10px] text-muted-foreground">{nodeDescription}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!hasOutgoingConnection && (isHovered || selected) && (
        <button
          ref={addButtonRef}
          onClick={handleAddClick}
          className="absolute -right-4 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 translate-x-full items-center justify-center rounded-full border border-white/20 bg-[#1a1a25]/90 text-muted-foreground shadow-lg backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-violet-400 hover:scale-110"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}

      {showAddPopover && (
        <div
          ref={popoverRef}
          className="fixed z-[9999] animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            left: popoverPos.x,
            top: popoverPos.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-72 overflow-hidden rounded-xl border border-white/10 bg-[#151520]/98 shadow-2xl shadow-black/50 backdrop-blur-xl">
            {/* Header */}
            <div className="border-b border-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-violet-400" />
                  <span className="text-sm font-medium text-foreground">Add Tile</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowAddPopover(false)
                  }}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Select a node to connect</p>
            </div>

            {/* Search */}
            <div className="border-b border-white/5 p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-full rounded-lg border border-violet-500/30 bg-violet-500/5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Node List */}
            <div className="max-h-64 overflow-y-auto p-1.5">
              {filteredCategories.map((category) => (
                <div key={category.name} className="mb-2">
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <Sparkles className="h-3 w-3 text-violet-400" />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {category.name} ({category.items.length})
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {category.items.map((item) => (
                      <button
                        key={item.type}
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddNode?.(item.type, nodeId)
                          setShowAddPopover(false)
                          setSearchQuery("")
                        }}
                        className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-all hover:bg-white/5"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} shadow-md`}
                        >
                          <div className="h-3.5 w-3.5 rounded-sm bg-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-foreground">{item.name}</span>
                            {item.isNew && (
                              <span className="rounded bg-violet-500 px-1 py-0.5 text-[9px] font-semibold uppercase text-white">
                                New
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[10px] text-muted-foreground">{item.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="py-6 text-center text-xs text-muted-foreground">No tiles found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
