"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Brain } from "lucide-react"
import { NodeControls } from "./node-controls"

interface MemoryNodeData {
  type: string
  maxMessages: number
  summarize: boolean
  [key: string]: unknown
}

export function MemoryNode({ data, selected, id }: NodeProps) {
  const nodeData = data as any

  return (
    <NodeControls
      nodeId={id}
      nodeName="Memory"
      nodeDescription="Manage conversation history and context"
      selected={selected}
      onDeleteNode={nodeData.onDeleteNode}
      onDuplicateNode={nodeData.onDuplicateNode}
    >
      <div
        className={`relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border-2 transition-all duration-200 min-w-[260px] ${selected ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-white/10 hover:border-white/20"
          }`}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-purple-500 !border-2 !border-purple-400"
        />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">Memory</div>
            <div className="text-purple-400 text-xs capitalize">{nodeData.type}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Max Messages</span>
            <span className="text-purple-400">{nodeData.maxMessages}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Auto Summarize</span>
            <span className={nodeData.summarize ? "text-emerald-400" : "text-white/40"}>
              {nodeData.summarize ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-purple-500 !border-2 !border-purple-400"
        />
      </div>
    </NodeControls>
  )
}
