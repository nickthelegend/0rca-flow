"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Wrench, Settings } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getStatusColor } from "@/lib/node-utils"
import { NodeControls } from "./node-controls"

export type ToolNodeData = {
  name: string
  description: string
  parameters?: Record<string, any>
  code?: string
  status?: "idle" | "running" | "completed" | "error"
  onAddNode?: (type: string, sourceNodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onDuplicateNode?: (nodeId: string) => void
  onCopyNode?: (nodeId: string) => void
  hasOutgoingConnection?: boolean
}

function ToolNode({ id, data, selected }: NodeProps<any>) {
  const status = data.status || "idle"
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NodeControls
        nodeId={id}
        nodeName="Custom Tool"
        nodeDescription="Tool for AI agents"
        nodeIcon={<Wrench className="h-3 w-3 text-white" />}
        nodeColor="bg-chart-4"
        selected={selected}
        isHovered={isHovered}
        hasOutgoingConnection={data.hasOutgoingConnection}
        onAddNode={data.onAddNode}
        onDeleteNode={data.onDeleteNode}
        onDuplicateNode={data.onDuplicateNode}
        onCopyNode={data.onCopyNode}
      >
        <Card className={`min-w-[280px] border-2 bg-card transition-all ${getStatusColor(status, selected)}`}>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-chart-4">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Tool</h3>
              <p className="text-xs text-muted-foreground">{data.name || "Custom Tool"}</p>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground">{data.description || "No description provided"}</p>
            {data.code && (
              <div className="mt-2 flex items-center gap-1 text-xs text-chart-3">
                <div className="h-1.5 w-1.5 rounded-full bg-chart-3" />
                Code implemented
              </div>
            )}
            {status === "running" && (
              <div className="mt-2 flex items-center gap-2 text-xs text-yellow-600">
                <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                Running...
              </div>
            )}
          </div>

          <Handle type="target" position={Position.Left} id="input" className="!bg-chart-4" />
          <Handle type="source" position={Position.Right} id="output" className="!bg-chart-4" />
        </Card>
      </NodeControls>
    </div>
  )
}

export default memo(ToolNode)
