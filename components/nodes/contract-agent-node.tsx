"use client"

import { useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Bot, Sparkles, Play, ChevronRight, MoreVertical, Copy, Trash2, GripVertical, FileCode, Search } from "lucide-react"

interface AgentCoreNodeData {
    name: string
    model: string
    description: string
    onAddNode?: (type: string, sourceNodeId: string) => void
    onDeleteNode?: (nodeId: string) => void
    onDuplicateNode?: (nodeId: string) => void
    [key: string]: unknown
}

export function ContractAgentNode({ data, selected, id }: NodeProps) {
    const nodeData = data as AgentCoreNodeData
    const [isHovered, setIsHovered] = useState(false)

    // Contract Agent Branding Colors (Deep Cyan/Teal)
    const borderColor = selected ? "border-[#00D1FF]" : "border-white/10 hover:border-white/20"
    const glowColor = selected ? "shadow-lg shadow-[#00D1FF]/20" : ""
    const gradient = "bg-gradient-to-br from-[#00D1FF] to-[#0052D1]"

    return (
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {/* Floating Toolbar */}
            {selected && (
                <div className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#1a1a25]/95 px-2 py-1.5 shadow-xl backdrop-blur-xl">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                nodeData.onDeleteNode?.(id)
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-red-400"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Hover Tooltip */}
            {isHovered && !selected && (
                <div className="absolute -top-14 left-1/2 z-40 -translate-x-1/2 animate-in fade-in-0 duration-150 pointer-events-none">
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a25]/95 px-3 py-2 shadow-lg backdrop-blur-xl whitespace-nowrap">
                        <div className={`flex h-6 w-6 items-center justify-center rounded ${gradient}`}>
                            <FileCode className="h-3 w-3 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-foreground">{nodeData.name || "Contract Agent"}</p>
                            <p className="text-[10px] text-muted-foreground">Smart Contract Expert</p>
                        </div>
                    </div>
                </div>
            )}

            <div
                className={`relative bg-gradient-to-br from-[#0a1515] to-[#050a0a] rounded-2xl border-2 transition-all duration-200 min-w-[320px] ${borderColor} ${glowColor}`}
            >
                {/* Main Input/Output Handles */}
                <Handle
                    type="target"
                    position={Position.Left}
                    id="trigger"
                    className="!w-4 !h-4 !bg-[#00D1FF] !border-2 !border-cyan-400 !rounded-sm"
                />

                <Handle
                    type="source"
                    position={Position.Right}
                    id="output"
                    className="!w-4 !h-4 !bg-[#00D1FF] !border-2 !border-cyan-400"
                />

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Search className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-white text-lg font-bold tracking-tight">{nodeData.name}</div>
                            <div className="text-[#00D1FF] text-[10px] uppercase font-bold tracking-[0.2em]">0rca Contract Agent</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D1FF]/10 border border-[#00D1FF]/20">
                        <Sparkles className="w-3 h-3 text-[#00D1FF]" />
                        <span className="text-[#00D1FF] text-[10px] font-bold">READY</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 pb-8 space-y-4 text-center">
                    <div className="text-sm text-white/50 leading-relaxed italic px-4 py-2 bg-white/[0.03] rounded-xl border border-white/5 inline-block">
                        "{nodeData.description || 'Specialized for Smart Contract interactions & ABI discovery'}"
                    </div>
                </div>

                {/* BOTTOM HANDLES */}
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

                    {/* Tools Handle */}
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

                    {/* Chain/RPC Handle */}
                    <div className="flex flex-col items-center gap-1">
                        <Handle
                            type="target"
                            position={Position.Bottom}
                            id="chain"
                            className="!w-3 !h-3 !bg-[#00D1FF] !border-2 !border-cyan-400 !static"
                            style={{ transform: "none" }}
                        />
                        <span className="text-[9px] font-bold text-cyan-500/60 uppercase tracking-tighter">Chain Config</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
