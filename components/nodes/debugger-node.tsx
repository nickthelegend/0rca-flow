"use client"

import { memo, useState, useEffect } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Monitor, Terminal, Trash2, Clock, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { NodeControls } from "./node-controls"

export type DebuggerNodeData = {
    logs?: { timestamp: string; content: string; type: 'info' | 'error' | 'success' }[]
    onAddNode?: (type: string, sourceNodeId: string) => void
    onDeleteNode?: (nodeId: string) => void
    onDuplicateNode?: (nodeId: string) => void
    onCopyNode?: (nodeId: string) => void
    [key: string]: any
}

function DebuggerNode({ id, data, selected }: NodeProps) {
    const nodeData = data as DebuggerNodeData
    const [isHovered, setIsHovered] = useState(false)
    const logs = nodeData.logs || []

    return (
        <NodeControls
            nodeId={id}
            nodeName="Real-Time Debugger"
            nodeDescription="Inspect data flow and execution logs"
            nodeIcon={<Monitor className="h-3 w-3 text-white" />}
            nodeColor="bg-emerald-600"
            selected={selected}
            isHovered={isHovered}
            onAddNode={nodeData.onAddNode}
            onDeleteNode={nodeData.onDeleteNode}
            onDuplicateNode={nodeData.onDuplicateNode}
            onCopyNode={nodeData.onCopyNode}
        >
            <Card
                className={`min-w-[260px] max-w-[320px] border-2 bg-black/95 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl ${selected ? "border-emerald-500/50 shadow-emerald-500/20" : "border-white/5 hover:border-emerald-500/30"
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center justify-between px-4 py-3 bg-emerald-600/[0.03] border-b border-emerald-500/10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/40 border border-emerald-400/20">
                            <Terminal className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-[10px] font-black text-white tracking-widest uppercase">Inspect v1.0</h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-tighter">Live</span>
                    </div>
                </div>

                <div className="p-3">
                    <div className="bg-black/60 rounded-xl border border-white/5 p-3 h-40 overflow-y-auto custom-scrollbar font-mono space-y-2">
                        {logs.length > 0 ? (
                            logs.map((log, idx) => (
                                <div key={idx} className="flex gap-2 text-[9px] leading-tight group">
                                    <span className="text-white/20 shrink-0">[{log.timestamp}]</span>
                                    <span className={`${log.type === 'error' ? 'text-red-400' :
                                            log.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
                                        } break-all`}>
                                        {log.content}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-20">
                                <Terminal className="w-8 h-8" />
                                <p className="text-[9px] uppercase font-black tracking-widest leading-none">Awaiting Stream</p>
                                <p className="text-[8px] italic max-w-[120px]">Connect a source to monitor output</p>
                            </div>
                        )}
                    </div>
                </div>

                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-3 !h-3 !bg-emerald-600 !border-2 !border-emerald-400 !-left-1.5"
                />
            </Card>
        </NodeControls>
    )
}

export default memo(DebuggerNode)
