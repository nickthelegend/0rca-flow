"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { BookOpen } from "lucide-react"
import { NodeControls } from "./node-controls"

interface KnowledgeBaseNodeData {
  sources: string[]
  embeddingModel: string
  chunkSize: number
  [key: string]: unknown
}

export function KnowledgeBaseNode({ data, selected, id }: NodeProps) {
  const nodeData = data as any // Use any to access injected handlers

  return (
    <NodeControls
      nodeId={id}
      nodeName="Knowledge Base"
      nodeDescription="Connect documents and data sources for RAG"
      selected={selected}
      onDeleteNode={nodeData.onDeleteNode}
      onDuplicateNode={nodeData.onDuplicateNode}
    >
      <div
        className={`relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border-2 transition-all duration-200 min-w-[260px] ${selected ? "border-cyan-500 shadow-lg shadow-cyan-500/20" : "border-white/10 hover:border-white/20"
          }`}
      >
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-cyan-400" />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">Knowledge Base</div>
            <div className="text-cyan-400 text-xs">{nodeData.sources?.length || 0} sources</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Embedding</span>
            <span className="text-cyan-400 font-mono text-[10px]">{nodeData.embeddingModel?.split("/")[1]}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Chunk Size</span>
            <span className="text-cyan-400">{nodeData.chunkSize} tokens</span>
          </div>
        </div>

        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-cyan-400" />
      </div>
    </NodeControls>
  )
}
