"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Split, ChevronRight, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { NodeControls } from "./node-controls"

export type RouterNodeData = {
    condition?: string
    routes?: { id: string; label: string }[]
    onAddNode?: (type: string, sourceNodeId: string) => void
    onDeleteNode?: (nodeId: string) => void
    onDuplicateNode?: (nodeId: string) => void
    onCopyNode?: (nodeId: string) => void
    [key: string]: any
}

function RouterNode({ id, data, selected }: NodeProps<any>) {
    const nodeData = data as RouterNodeData
    const [isHovered, setIsHovered] = useState(false)
    const routes = nodeData.routes || [
        { id: "true", label: "Path A" },
        { id: "false", label: "Path B" }
    ]

    return (
        <NodeControls
            nodeId={id}
            nodeName="Logic Router"
            nodeDescription="Conditional path execution and data routing"
            nodeIcon={<Split className="h-3 w-3 text-white" />}
            nodeColor="bg-pink-600"
            selected={selected}
            isHovered={isHovered}
            onAddNode={nodeData.onAddNode}
            onDeleteNode={nodeData.onDeleteNode}
            onDuplicateNode={nodeData.onDuplicateNode}
            onCopyNode={nodeData.onCopyNode}
        >
            <Card
                className={`min-w-[200px] border-2 bg-[#09090b]/95 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl ${selected ? "border-pink-500/50 shadow-pink-500/20" : "border-white/5 hover:border-pink-500/30"
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-3 px-4 py-3 bg-pink-600/[0.03] border-b border-white/5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-900/40 border border-pink-400/20">
                        <Split className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] font-black text-white tracking-widest uppercase">Logic Router</h3>
                    </div>
                </div>

                <div className="p-3 space-y-3">
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Condition</p>
                        <p className="text-[10px] text-pink-400 font-mono italic truncate">
                            {nodeData.condition || "if result.status == 'ok'..."}
                        </p>
                    </div>

                    <div className="space-y-1.5 focus-within:opacity-100 transition-opacity">
                        {routes.map((route, idx) => (
                            <div key={route.id} className="relative flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/5 group border-dashed">
                                <span className="text-[9px] font-bold text-white/60 tracking-tight">{route.label}</span>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={route.id}
                                    className="!w-2 !h-2 !bg-pink-500 !border-white/20 !-right-1"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-3 !h-3 !bg-pink-600 !border-2 !border-pink-400 !-left-1.5"
                />
            </Card>
        </NodeControls>
    )
}

export default memo(RouterNode)
