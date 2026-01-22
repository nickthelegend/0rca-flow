"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Briefcase } from "lucide-react"
import { Card } from "@/components/ui/card"

export function ToolkitNode({ selected }: NodeProps<any>) {
    return (
        <div className="relative group">
            <div className={`p-0.5 rounded-2xl bg-gradient-to-br from-blue-500/50 to-indigo-600/50 transition-all ${selected ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-500/20' : 'hover:scale-105 transition-transform'}`}>
                <Card className="min-w-[180px] h-20 bg-[#0f0f1a]/90 backdrop-blur-xl border-none text-white flex flex-col items-center justify-center relative">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Briefcase className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Toolkit</div>
                    </div>

                    {/* Target for incoming tools from BELOW */}
                    <Handle
                        type="target"
                        position={Position.Bottom}
                        id="tools-input"
                        className="!w-8 !h-2 !bg-amber-500 !border-none !rounded-full translate-y-1"
                    />

                    {/* Source for outgoing kit to ABOVE (Agent) */}
                    <Handle
                        type="source"
                        position={Position.Top}
                        id="output"
                        className="!w-4 !h-4 !bg-blue-500 !border-2 !border-blue-400 -translate-y-1"
                    />
                </Card>
            </div>

            {/* Visual background glow */}
            <div className="absolute inset-0 bg-blue-500/10 blur-2xl -z-10 rounded-full" />
        </div>
    )
}

export default memo(ToolkitNode)
