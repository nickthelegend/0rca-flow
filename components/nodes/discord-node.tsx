"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Hash } from "lucide-react"

export function DiscordNode({ data, selected }: NodeProps<any>) {
    return (
        <div className={`relative group transition-all duration-300 ${selected ? "scale-110" : "hover:scale-105"}`}>
            <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center p-4 border-2 shadow-2xl backdrop-blur-xl transition-colors
        ${selected ? "bg-[#5865F2]/20 border-[#5865F2] shadow-[#5865F2]/20" : "bg-black/80 border-white/10 hover:border-[#5865F2]/50"}`}>

                <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center mb-1 shadow-lg shadow-[#5865F2]/40">
                    <Hash className="w-6 h-6 text-white" />
                </div>

                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Discord</span>
                <span className="text-[8px] text-[#5865F2] font-mono tracking-widest leading-none">HOOK</span>

                <Handle
                    type="source"
                    position={Position.Top}
                    className="!w-3 !h-3 !bg-[#5865F2] !border-2 !border-[#7289da]"
                />
                <Handle
                    type="target"
                    position={Position.Bottom}
                    className="!w-3 !h-3 !bg-[#5865F2] !border-2 !border-[#7289da]"
                />
            </div>

            {/* Label outside circular node */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[11px] font-bold text-white/40 group-hover:text-white/80 transition-colors uppercase tracking-[0.2em]">Discord Webhook</span>
            </div>
        </div>
    )
}

export default memo(DiscordNode)
