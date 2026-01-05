"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Play } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getStatusColor } from "@/lib/node-utils"
import { NodeControls } from "./node-controls"

export type StartNodeData = {
  status?: "idle" | "running" | "completed" | "error"
  output?: any
  onAddNode?: (type: string, sourceNodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onDuplicateNode?: (nodeId: string) => void
  onCopyNode?: (nodeId: string) => void
  hasOutgoingConnection?: boolean
}

function StartNode({ id, data, selected }: NodeProps<StartNodeData>) {
  const status = data.status || "idle"
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NodeControls
        nodeId={id}
        nodeName="Start"
        nodeDescription="Workflow entry point"
        nodeIcon={<Play className="h-3 w-3 text-white" />}
        nodeColor="bg-green-500"
        selected={selected}
        isHovered={isHovered}
        hasOutgoingConnection={data.hasOutgoingConnection}
        onAddNode={data.onAddNode}
        onDeleteNode={data.onDeleteNode}
        onDuplicateNode={data.onDuplicateNode}
        onCopyNode={data.onCopyNode}
      />

      <Card className={`min-w-[200px] border-2 bg-card transition-all ${getStatusColor(status, selected)}`}>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
            <Play className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Start</h3>
            <p className="text-xs text-muted-foreground">Workflow entry point</p>
          </div>
        </div>

        {status === "running" && (
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-yellow-600">
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            Starting...
          </div>
        )}

        <Handle type="source" position={Position.Right} id="output" className="!bg-green-500" />
      </Card>
    </div>
  )
}

export default memo(StartNode)
