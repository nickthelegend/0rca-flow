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

function TextModelNode({ id, data, selected }: NodeProps<TextModelNodeData>) {
  const status = data.status || "idle"
  const [isHovered, setIsHovered] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Floating Toolbar */}
      {selected && (
        <div className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-card/95 px-2 py-1.5 shadow-xl backdrop-blur-xl">
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
              <div className="min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-popover/95 py-1 shadow-xl backdrop-blur-xl">
                <button
                  onClick={() => {
                    data.onCopyNode?.(id)
                    setShowContextMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  Copy to clipboard
                </button>
                <button
                  onClick={() => {
                    data.onDuplicateNode?.(id)
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
                    data.onDeleteNode?.(id)
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
        <div className="absolute -top-14 left-1/2 z-40 -translate-x-1/2 animate-in fade-in-0 duration-150">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-xl whitespace-nowrap">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <MessageSquare className="h-3 w-3 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Text Model</p>
              <p className="text-[10px] text-muted-foreground">Generate text with AI</p>
            </div>
          </div>
        </div>
      )}

      <Card
        className={`min-w-[280px] max-w-[400px] border-2 bg-card transition-all ${getStatusColor(status, selected)}`}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <MessageSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Text Model</h3>
            <p className="text-xs text-muted-foreground">{data.model || "openai/gpt-5"}</p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-2 p-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Temperature:</span>
            <span className="font-mono text-foreground">{data.temperature || 0.7}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Max Tokens:</span>
            <span className="font-mono text-foreground">{data.maxTokens || 2000}</span>
          </div>
          {data.structuredOutput && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Structured:</span>
              <span className="font-mono text-foreground">{data.schemaName || "Yes"}</span>
            </div>
          )}
          {status === "running" && (
            <div className="flex items-center gap-2 text-xs text-yellow-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
              Running...
            </div>
          )}
        </div>

        {data.output && (
          <div className="border-t border-border bg-secondary/30 p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Output:</p>
            <div className="rounded bg-background p-2 max-h-32 overflow-y-auto">
              <p className="text-xs text-foreground whitespace-pre-wrap break-words">
                {typeof data.output === "object" && data.output.text
                  ? data.output.text
                  : typeof data.output === "string"
                    ? data.output
                    : JSON.stringify(data.output, null, 2)}
              </p>
            </div>
          </div>
        )}

        <Handle type="target" position={Position.Left} id="prompt" className="!bg-primary" />
        <Handle type="source" position={Position.Right} id="output" className="!bg-primary" />
      </Card>


    </div>
  )
}

export default memo(TextModelNode)
