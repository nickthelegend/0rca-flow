"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { MessageCircle } from "lucide-react"

export function TelegramNode({ data, selected }: NodeProps) {
    return (
        <div className={`relative group transition-all duration-300 ${selected ? "scale-110" : "hover:scale-105"}`}>
            <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center p-4 border-2 shadow-2xl backdrop-blur-xl transition-colors
        ${selected ? "bg-sky-500/20 border-sky-400 shadow-sky-500/20" : "bg-black/80 border-white/10 hover:border-sky-500/50"}`}>

                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center mb-1 shadow-lg shadow-sky-500/40">
                    <MessageCircle className="w-6 h-6 text-white" />
                </div>

                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Telegram</span>
                <span className="text-[8px] text-sky-400 font-mono tracking-widest leading-none">API</span>

                <Handle
                    type="source"
                    position={Position.Top}
                    className="!w-3 !h-3 !bg-sky-500 !border-2 !border-sky-400"
                />
                <Handle
                    type="target"
                    position={Position.Bottom}
                    className="!w-3 !h-3 !bg-sky-500 !border-2 !border-sky-400"
                />
            </div>

            {/* Label outside circular node */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[11px] font-bold text-white/40 group-hover:text-white/80 transition-colors uppercase tracking-[0.2em]">Telegram API</span>
            </div>
        </div>
    )
}

export default memo(TelegramNode)
