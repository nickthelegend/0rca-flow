"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Clock, Calendar, Play } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getStatusColor } from "@/lib/node-utils"
import { NodeControls } from "./node-controls"

export type CronNodeData = {
    schedule: string
    timezone: string
    lastRun?: string
    nextRun?: string
    status?: "idle" | "running" | "completed" | "error"
    onAddNode?: (type: string, sourceNodeId: string) => void
    onDeleteNode?: (nodeId: string) => void
    onDuplicateNode?: (nodeId: string) => void
    onCopyNode?: (nodeId: string) => void
    hasOutgoingConnection?: boolean
    [key: string]: any
}

function CronNode({ id, data, selected }: NodeProps<any>) {
    const nodeData = data as unknown as CronNodeData
    const status = nodeData.status || "idle"
    const [isHovered, setIsHovered] = useState(false)

    return (
        <NodeControls
            nodeId={id}
            nodeName="Cron Scheduler"
            nodeDescription="Execute workflow on a recurring schedule"
            nodeIcon={<Clock className="h-3 w-3 text-white" />}
            nodeColor="bg-amber-600"
            selected={selected}
            isHovered={isHovered}
            hasOutgoingConnection={nodeData.hasOutgoingConnection}
            onAddNode={nodeData.onAddNode}
            onDeleteNode={nodeData.onDeleteNode}
            onDuplicateNode={nodeData.onDuplicateNode}
            onCopyNode={nodeData.onCopyNode}
        >
            <Card
                className={`min-w-[260px] max-w-[380px] border-2 bg-[#09090b]/90 backdrop-blur-xl transition-all ${getStatusColor(status, selected)}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3 bg-amber-600/10 rounded-t-xl">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 shadow-lg shadow-amber-600/20">
                        <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-white tracking-tight uppercase">CronOS Trigger</h3>
                        <p className="text-[10px] text-amber-400 font-mono">{nodeData.schedule || "0 * * * *"}</p>
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <span>Next Execution</span>
                        <span className="text-amber-400 font-mono lowercase">{nodeData.nextRun || "calculating..."}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-white/20" />
                        <div className="flex-1">
                            <p className="text-[9px] text-white/30 uppercase font-bold">Timezone</p>
                            <p className="text-xs text-white/80">{nodeData.timezone || "UTC"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-white/30 italic pt-1">
                        <div className="h-1 w-1 rounded-full bg-amber-500/50" />
                        Active background daemon...
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-amber-500 !border-2 !border-amber-400"
                />
            </Card>
        </NodeControls>
    )
}

export default memo(CronNode)
