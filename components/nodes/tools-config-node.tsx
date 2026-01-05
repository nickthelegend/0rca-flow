"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Wrench, Globe, Code, Search } from "lucide-react"
import { NodeControls } from "./node-controls"

interface ToolsConfigNodeData {
  tools: string[]
  enableCodeInterpreter: boolean
  enableWebSearch: boolean
  [key: string]: unknown
}

export function ToolsConfigNode({ data, selected, id }: NodeProps) {
  const nodeData = data as ToolsConfigNodeData

  const activeTools = [
    ...(nodeData.enableWebSearch ? ["Web Search"] : []),
    ...(nodeData.enableCodeInterpreter ? ["Code Interpreter"] : []),
    ...(nodeData.tools || []),
  ]

  return (
    <NodeControls nodeId={id} nodeName="Tools Config" nodeDescription="Configure tools and capabilities for your agent">
      <div
        className={`relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border-2 transition-all duration-200 min-w-[260px] ${
          selected ? "border-orange-500 shadow-lg shadow-orange-500/20" : "border-white/10 hover:border-white/20"
        }`}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-400"
        />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">Tools</div>
            <div className="text-orange-400 text-xs">{activeTools.length} active</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {activeTools.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeTools.slice(0, 4).map((tool, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 text-xs text-white/70"
                >
                  {tool === "Web Search" && <Globe className="w-3 h-3 text-orange-400" />}
                  {tool === "Code Interpreter" && <Code className="w-3 h-3 text-orange-400" />}
                  {tool !== "Web Search" && tool !== "Code Interpreter" && (
                    <Search className="w-3 h-3 text-orange-400" />
                  )}
                  {tool}
                </div>
              ))}
              {activeTools.length > 4 && (
                <div className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/50">
                  +{activeTools.length - 4} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-white/40">No tools configured</div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-400"
        />
      </div>
    </NodeControls>
  )
}
