"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Database, Brain, Sparkles, Layout } from "lucide-react"
import { Card } from "@/components/ui/card"
import { NodeControls } from "./node-controls"

export type StateNodeData = {
    storageKey?: string
    variables?: { name: string; value: string }[]
    onAddNode?: (type: string, sourceNodeId: string) => void
    onDeleteNode?: (nodeId: string) => void
    onDuplicateNode?: (nodeId: string) => void
    onCopyNode?: (nodeId: string) => void
    [key: string]: any
}

function StateNode({ id, data, selected }: NodeProps<any>) {
    const nodeData = data as StateNodeData
    const [isHovered, setIsHovered] = useState(false)
    const variables = nodeData.variables || [
        { name: "userName", value: "0rca_User" },
        { name: "lastAction", value: "none" }
    ]

    return (
        <NodeControls
            nodeId={id}
            nodeName="Memory Kernel"
            nodeDescription="Persistent state and session memory storage"
            nodeIcon={<Database className="h-3 w-3 text-white" />}
            nodeColor="bg-blue-600"
            selected={selected}
            isHovered={isHovered}
            onAddNode={nodeData.onAddNode}
            onDeleteNode={nodeData.onDeleteNode}
            onDuplicateNode={nodeData.onDuplicateNode}
            onCopyNode={nodeData.onCopyNode}
        >
            <Card
                className={`min-w-[220px] border-2 bg-[#09090b]/95 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl ${selected ? "border-blue-500/50 shadow-blue-500/20" : "border-white/5 hover:border-blue-500/30"
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-600/[0.03] border-b border-white/5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-900/40 border border-blue-400/20">
                        <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[11px] font-black text-white tracking-widest uppercase">Memory Kernel</h3>
                        <p className="text-[9px] text-blue-400 font-mono tracking-tighter uppercase">{nodeData.storageKey || "local.0rca.session"}</p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Live Registry</span>
                            <span className="text-[10px] font-mono text-blue-400">{variables.length} keys</span>
                        </div>

                        <div className="space-y-1.5 focus-within:opacity-100 transition-opacity">
                            {variables.map((v, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Layout className="w-3 h-3 text-blue-500/40" />
                                        <span className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors truncate">{v.name}</span>
                                    </div>
                                    <div className="text-[9px] text-white/30 font-mono italic">{v.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-3 !h-3 !bg-blue-600 !border-2 !border-blue-400 !-left-1.5"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-blue-600 !border-2 !border-blue-400 !-right-1.5"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="memory"
                    className="!w-3 !h-3 !bg-blue-600 !border-2 !border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                />
            </Card>
        </NodeControls>
    )
}

export default memo(StateNode)
