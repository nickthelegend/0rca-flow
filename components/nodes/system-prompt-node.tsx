"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { FileText } from "lucide-react"
import { NodeControls } from "./node-controls"

interface SystemPromptNodeData {
  content: string
  role: string
  [key: string]: unknown
}

export function SystemPromptNode({ data, selected, id }: NodeProps<any>) {
  const nodeData = data as any

  return (
    <NodeControls
      nodeId={id}
      nodeName="System Prompt"
      nodeDescription="Define the agent's personality and instructions"
      selected={selected}
      onDeleteNode={nodeData.onDeleteNode}
      onDuplicateNode={nodeData.onDuplicateNode}
    >
      <div
        className={`relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border-2 transition-all duration-200 min-w-[260px] ${selected ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-white/10 hover:border-white/20"
          }`}
      >
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-blue-400" />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">System Prompt</div>
            <div className="text-blue-400 text-xs">Instructions</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-xs text-white/60 line-clamp-3 font-mono bg-white/5 rounded-lg p-2">
            {nodeData.content || "No prompt defined..."}
          </div>
        </div>

        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-blue-400" />
      </div>
    </NodeControls>
  )
}
