"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Cpu } from "lucide-react"

export function IntelligenceModelNode({ data, selected }: NodeProps) {
    const modelName = (data.model as string) || "gpt-4o"

    return (
        <div className={`relative group transition-all duration-300 ${selected ? "scale-110" : "hover:scale-105"}`}>
            <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center p-4 border-2 shadow-2xl backdrop-blur-xl transition-colors
        ${selected ? "bg-violet-500/20 border-violet-400 shadow-violet-500/20" : "bg-black/80 border-white/10 hover:border-violet-500/50"}`}>

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-1 shadow-lg shadow-violet-500/40">
                    <Cpu className="w-7 h-7 text-white" />
                </div>

                <span className="text-[10px] font-bold text-white uppercase tracking-tighter text-center line-clamp-1">{modelName}</span>
                <span className="text-[8px] text-violet-400 font-mono tracking-widest leading-none">MODEL</span>

                <Handle
                    type="source"
                    position={Position.Top}
                    id="output"
                    className="!w-3 !h-3 !bg-violet-500 !border-2 !border-violet-400"
                />
            </div>

            {/* Label outside circular node */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[11px] font-bold text-white/40 group-hover:text-white/80 transition-colors uppercase tracking-[0.2em]">OpenAI Chat Model</span>
            </div>
        </div>
    )
}

export default memo(IntelligenceModelNode)
