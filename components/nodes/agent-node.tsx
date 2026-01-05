"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Bot } from "lucide-react"
import Image from "next/image"

export function AgentNode({ data, selected }: NodeProps) {
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
        return "from-emerald-500 to-teal-500"
    }
  }

  return (
    <div
      className={`min-w-[220px] rounded-xl border bg-card/90 backdrop-blur-sm shadow-xl transition-all ${
        selected ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-white/10"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 p-3 rounded-t-xl bg-gradient-to-r ${getCategoryColor(data.category)} bg-opacity-10`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${getCategoryColor(data.category)} shadow-lg overflow-hidden`}
        >
          {data.avatar ? (
            <Image
              src={data.avatar || "/placeholder.svg"}
              alt={data.name || "Agent"}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate">{data.name || "AI Agent"}</span>
          </div>
          <span className="text-xs text-emerald-400">{data.category || "Agent"}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 border-t border-white/5">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {data.description || "An autonomous AI agent that can perform tasks"}
        </p>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-300"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-300"
      />
    </div>
  )
}

export default AgentNode
