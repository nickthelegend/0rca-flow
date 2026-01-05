"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MousePointer2, Hand, ZoomIn, ZoomOut, Grid3X3 } from "lucide-react"
import { AddNodePopover } from "@/components/add-node-popover"
import { AgentAddNodePopover } from "@/components/agent-add-node-popover"

type LeftToolbarProps = {
  onAddNode: (type: string) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitView?: () => void
  activeTool?: "select" | "pan"
  onToolChange?: (tool: "select" | "pan") => void
  showPropertiesPanel?: boolean
  isAgentBuilder?: boolean
}

export function LeftToolbar({
  onAddNode,
  onZoomIn,
  onZoomOut,
  onFitView,
  activeTool = "select",
  onToolChange,
  isAgentBuilder = false,
}: LeftToolbarProps) {
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const [showAddPopover, setShowAddPopover] = useState(false)

  const handleAddNode = (type: string) => {
    onAddNode(type)
    setShowAddPopover(false)
  }

  return (
    <aside className="absolute left-4 top-1/2 z-40 -translate-y-1/2">
      <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-[#1a1a25]/90 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl">
        {/* Add Node Button */}
        <Button
          ref={addButtonRef}
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-lg transition-all text-muted-foreground ${
            isAgentBuilder
              ? "hover:bg-emerald-500/20 hover:text-emerald-400"
              : "hover:bg-violet-500/20 hover:text-violet-400"
          } ${showAddPopover ? (isAgentBuilder ? "bg-emerald-500/20 text-emerald-400" : "bg-violet-500/20 text-violet-400") : ""}`}
          onClick={() => setShowAddPopover(!showAddPopover)}
          title="Add Node"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <div className="my-1 h-px bg-white/5" />

        {/* Selection Tool */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-lg transition-all ${
            activeTool === "select"
              ? isAgentBuilder
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-violet-500/20 text-violet-400"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
          onClick={() => onToolChange?.("select")}
          title="Select Tool"
        >
          <MousePointer2 className="h-4 w-4" />
        </Button>

        {/* Pan Tool */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-lg transition-all ${
            activeTool === "pan"
              ? isAgentBuilder
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-violet-500/20 text-violet-400"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
          onClick={() => onToolChange?.("pan")}
          title="Pan Tool"
        >
          <Hand className="h-4 w-4" />
        </Button>

        <div className="my-1 h-px bg-white/5" />

        {/* Zoom In */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
          onClick={onZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Zoom Out */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
          onClick={onZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <div className="my-1 h-px bg-white/5" />

        {/* Fit View */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
          onClick={onFitView}
          title="Fit View"
        >
          <span className="text-[10px] font-bold">Fit</span>
        </Button>

        {/* Minimap Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
          title="Toggle Minimap"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>

      {isAgentBuilder ? (
        <AgentAddNodePopover
          isOpen={showAddPopover}
          onClose={() => setShowAddPopover(false)}
          triggerRef={addButtonRef}
          onAddNode={handleAddNode}
        />
      ) : (
        <AddNodePopover
          isOpen={showAddPopover}
          onClose={() => setShowAddPopover(false)}
          triggerRef={addButtonRef}
          onAddNode={handleAddNode}
        />
      )}
    </aside>
  )
}
