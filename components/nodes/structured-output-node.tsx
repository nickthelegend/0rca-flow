"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { FileJson, Settings } from "lucide-react"
import { Card } from "@/components/ui/card"
import { NodeControls } from "./node-controls"

export type StructuredOutputNodeData = {
  schemaName: string
  mode: "object" | "array"
  onAddNode?: (type: string, sourceNodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onDuplicateNode?: (nodeId: string) => void
  onCopyNode?: (nodeId: string) => void
  hasOutgoingConnection?: boolean
}

function StructuredOutputNode({ id, data, selected }: NodeProps<StructuredOutputNodeData>) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NodeControls
        nodeId={id}
        nodeName="Structured Output"
        nodeDescription="Parse into schema"
        nodeIcon={<FileJson className="h-3 w-3 text-white" />}
        nodeColor="bg-chart-3"
        selected={selected}
        isHovered={isHovered}
        hasOutgoingConnection={data.hasOutgoingConnection}
        onAddNode={data.onAddNode}
        onDeleteNode={data.onDeleteNode}
        onDuplicateNode={data.onDuplicateNode}
        onCopyNode={data.onCopyNode}
      />

      <Card
        className={`min-w-[280px] border-2 bg-card transition-all ${
          selected ? "border-primary shadow-lg" : "border-border"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-chart-3">
            <FileJson className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Structured Output</h3>
            <p className="text-xs text-muted-foreground">{data.schemaName || "Schema"}</p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-2 p-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Mode:</span>
            <span className="font-mono text-foreground">{data.mode || "object"}</span>
          </div>
        </div>

        <Handle type="target" position={Position.Left} id="input" className="!bg-chart-3" />
        <Handle type="source" position={Position.Right} id="output" className="!bg-chart-3" />
      </Card>
    </div>
  )
}

export default memo(StructuredOutputNode)
