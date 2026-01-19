"use client"

import { useState, useRef } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Bot, Sparkles, Play, ChevronRight, MoreVertical, Copy, Trash2, GripVertical } from "lucide-react"

interface AgentCoreNodeData {
  name: string
  model: string
  description: string
  onAddNode?: (type: string, sourceNodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onDuplicateNode?: (nodeId: string) => void
  [key: string]: unknown
}

export function AgentCoreNode({ data, selected, id }: NodeProps) {
  const nodeData = data as AgentCoreNodeData
  const [isHovered, setIsHovered] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
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
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5">
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  Copy to clipboard
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nodeData.onDuplicateNode?.(id)
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
                    nodeData.onDeleteNode?.(id)
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
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-teal-500">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{nodeData.name || "Agent Core"}</p>
              <p className="text-[10px] text-muted-foreground">The central brain of your AI agent</p>
            </div>
          </div>
        </div>
      )}



      <div
        className={`relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border-2 transition-all duration-200 min-w-[320px] ${selected ? "border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-white/10 hover:border-white/20"
          }`}
      >
        {/* Main Input/Output Handles */}
        <Handle
          type="target"
          position={Position.Left}
          id="trigger"
          className="!w-4 !h-4 !bg-emerald-500 !border-2 !border-emerald-400 !rounded-sm"
        />

        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-4 !h-4 !bg-emerald-500 !border-2 !border-emerald-400"
        />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white text-lg font-bold tracking-tight">{nodeData.name}</div>
              <div className="text-emerald-400 text-[10px] uppercase font-bold tracking-[0.2em]">Tools Agent</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 text-[10px] font-bold">ACTIVE</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pb-8 space-y-4 text-center">
          <div className="text-sm text-white/50 leading-relaxed italic px-4 py-2 bg-white/[0.03] rounded-xl border border-white/5 inline-block">
            "{nodeData.description}"
          </div>
        </div>

        {/* BOTTOM HANDLES (Modular Architecture) */}
        <div className="absolute -bottom-10 left-0 right-0 flex justify-around px-4">
          {/* Chat Model Handle */}
          <div className="flex flex-col items-center gap-1">
            <Handle
              type="target"
              position={Position.Bottom}
              id="model"
              className="!w-3 !h-3 !bg-violet-500 !border-2 !border-violet-400 !static"
              style={{ transform: "none" }}
            />
            <span className="text-[9px] font-bold text-violet-400/60 uppercase tracking-tighter">Chat Model <span className="text-red-500">*</span></span>
          </div>

          {/* Memory Handle */}
          <div className="flex flex-col items-center gap-1">
            <Handle
              type="target"
              position={Position.Bottom}
              id="memory"
              className="!w-3 !h-3 !bg-blue-500 !border-2 !border-blue-400 !static"
              style={{ transform: "none" }}
            />
            <span className="text-[9px] font-bold text-blue-400/60 uppercase tracking-tighter">Memory</span>
          </div>

          {/* Tool Handle */}
          <div className="flex flex-col items-center gap-1">
            <Handle
              type="target"
              position={Position.Bottom}
              id="tool"
              className="!w-3 !h-3 !bg-amber-500 !border-2 !border-amber-400 !static"
              style={{ transform: "none" }}
            />
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-tighter">Tool</span>
          </div>
          {/* Wallet Handle */}
          <div className="flex flex-col items-center gap-1">
            <Handle
              type="target"
              position={Position.Bottom}
              id="wallet"
              className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-400 !static"
              style={{ transform: "none" }}
            />
            <span className="text-[9px] font-bold text-orange-400/60 uppercase tracking-tighter">Wallet</span>
          </div>
        </div>
      </div>
    </div>
  )
}
