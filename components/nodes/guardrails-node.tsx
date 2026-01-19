"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Shield, AlertTriangle } from "lucide-react"
import { NodeControls } from "./node-controls"

interface GuardrailsNodeData {
  inputFilters: string[]
  outputFilters: string[]
  contentPolicy: string
  [key: string]: unknown
}

export function GuardrailsNode({ data, selected, id }: NodeProps) {
  const nodeData = data as any

  const totalFilters = (nodeData.inputFilters?.length || 0) + (nodeData.outputFilters?.length || 0)

  return (
    <NodeControls
      nodeId={id}
      nodeName="Guardrails"
      nodeDescription="Safety filters and content moderation"
      selected={selected}
      onDeleteNode={nodeData.onDeleteNode}
      onDuplicateNode={nodeData.onDuplicateNode}
    >
      <div
        className={`relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border-2 transition-all duration-200 min-w-[260px] ${selected ? "border-red-500 shadow-lg shadow-red-500/20" : "border-white/10 hover:border-white/20"
          }`}
      >
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-red-500 !border-2 !border-red-400" />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">Guardrails</div>
            <div className="text-red-400 text-xs">{totalFilters} filters active</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Content Policy</span>
            <span className="text-red-400 capitalize">{nodeData.contentPolicy}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400">Safety enabled</span>
          </div>
        </div>

        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-red-500 !border-2 !border-red-400" />
      </div>
    </NodeControls>
  )
}
