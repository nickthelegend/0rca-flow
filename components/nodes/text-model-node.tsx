"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import {
  MessageSquare,
  Settings,
  Play,
  ChevronRight,
  MoreVertical,
  Copy,
  Trash2,
  GripVertical,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { getStatusColor } from "@/lib/node-utils"

export type TextModelNodeData = {
  model: string
  temperature: number
  maxTokens: number
  prompt?: string
  status?: "idle" | "running" | "completed" | "error"
  structuredOutput?: boolean
  schema?: string
  schemaName?: string
  output?: any
  onAddNode?: (type: string, sourceNodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onDuplicateNode?: (nodeId: string) => void
  onCopyNode?: (nodeId: string) => void
  hasOutgoingConnection?: boolean
}

function TextModelNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as TextModelNodeData
  const status = nodeData.status || "idle"
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
              onClick={() => setShowContextMenu(!showContextMenu)}
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
                  onClick={() => {
                    nodeData.onCopyNode?.(id)
                    setShowContextMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  Copy to clipboard
                </button>
                <button
                  onClick={() => {
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
                  onClick={() => {
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
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-purple-500">
              <MessageSquare className="h-3 w-3 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-white">Intelligence Gateway</p>
              <p className="text-[10px] text-white/40">Connect specific LLMs to your agents</p>
            </div>
          </div>
        </div>
      )}

      <Card
        className={`min-w-[280px] max-w-[400px] border-2 bg-[#09090b]/90 backdrop-blur-xl transition-all ${getStatusColor(status, selected)}`}
      >
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3 bg-violet-600/10 rounded-t-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">Intelligence</h3>
            <p className="text-[10px] text-violet-400 font-mono truncate">{nodeData.model || "gpt-4o"}</p>
          </div>
          <Settings className="h-4 w-4 text-white/20" />
        </div>

        <div className="space-y-3 p-4">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/40">
            <span>Precision</span>
            <span className="text-violet-400">{(1 - (nodeData.temperature || 0.7)).toFixed(2)}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500" style={{ width: `${(1 - (nodeData.temperature || 0.7)) * 100}%` }} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-white/[0.03] border border-white/5 p-2 rounded-lg">
              <p className="text-[9px] text-white/30 uppercase font-bold">Max Tokens</p>
              <p className="text-xs font-mono text-white/80">{nodeData.maxTokens || 2000}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-2 rounded-lg">
              <p className="text-[9px] text-white/30 uppercase font-bold">Context</p>
              <p className="text-xs font-mono text-white/80">Active</p>
            </div>
          </div>
          {nodeData.structuredOutput && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground text-[10px]">Structured:</span>
              <span className="font-mono text-white/60 text-[10px]">{nodeData.schemaName || "Yes"}</span>
            </div>
          )}
          {status === "running" && (
            <div className="flex items-center gap-2 text-[10px] text-yellow-500/80 uppercase font-bold tracking-tighter pt-1">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              Processing Neural Path...
            </div>
          )}
        </div>

        {nodeData.output && (
          <div className="border-t border-white/5 bg-white/[0.02] p-3">
            <p className="mb-1 text-[9px] font-bold text-white/30 uppercase tracking-widest">Neural Response:</p>
            <div className="rounded-lg bg-black/40 border border-white/5 p-2 max-h-32 overflow-y-auto custom-scrollbar">
              <p className="text-[11px] text-white/70 whitespace-pre-wrap break-words font-mono leading-relaxed">
                {typeof nodeData.output === "object" && nodeData.output.text
                  ? nodeData.output.text
                  : typeof nodeData.output === "string"
                    ? nodeData.output
                    : JSON.stringify(nodeData.output, null, 2)}
              </p>
            </div>
          </div>
        )}

        <Handle type="target" position={Position.Left} id="prompt" className="!w-3 !h-3 !bg-violet-500 !border-2 !border-violet-400" />
        <Handle type="source" position={Position.Right} id="output" className="!w-3 !h-3 !bg-violet-500 !border-2 !border-violet-400" />
      </Card>
    </div>
  )
}

export default memo(TextModelNode)
