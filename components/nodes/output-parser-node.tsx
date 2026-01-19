"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { FileOutput, Braces } from "lucide-react"
import { NodeControls } from "./node-controls"

interface OutputParserNodeData {
  format: string
  schema: any
  validation: boolean
  [key: string]: unknown
}

export function OutputParserNode({ data, selected, id }: NodeProps) {
  const nodeData = data as any

  return (
    <NodeControls
      nodeId={id}
      nodeName="Output Parser"
      nodeDescription="Format and validate agent responses"
      selected={selected}
      onDeleteNode={nodeData.onDeleteNode}
      onDuplicateNode={nodeData.onDuplicateNode}
    >
      <div
        className={`relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border-2 transition-all duration-200 min-w-[260px] ${selected ? "border-yellow-500 shadow-lg shadow-yellow-500/20" : "border-white/10 hover:border-white/20"
          }`}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-yellow-400"
        />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <FileOutput className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">Output Parser</div>
            <div className="text-yellow-400 text-xs capitalize">{nodeData.format} format</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Validation</span>
            <span className={nodeData.validation ? "text-emerald-400" : "text-white/40"}>
              {nodeData.validation ? "Enabled" : "Disabled"}
            </span>
          </div>
          {nodeData.schema && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Braces className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400">Schema defined</span>
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-yellow-400"
        />
      </div>
    </NodeControls>
  )
}
