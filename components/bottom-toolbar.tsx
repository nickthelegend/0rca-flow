"use client"

import { Button } from "@/components/ui/button"
import { Save, Hand, Play, Undo, Redo } from "lucide-react"

type BottomToolbarProps = {
  onSave?: () => void
  onPlay?: () => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  isPanMode?: boolean
  onPanToggle?: () => void
}

export function BottomToolbar({
  onSave,
  onPlay,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
  isPanMode,
  onPanToggle,
}: BottomToolbarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-2xl border border-white/10 bg-card/80 px-2 py-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-xl text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
        onClick={onSave}
        title="Save Workflow"
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-xl transition-all ${
          isPanMode
            ? "bg-violet-500/20 text-violet-400"
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        }`}
        onClick={onPanToggle}
        title="Pan Tool"
      >
        <Hand className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-5 w-px bg-white/10" />

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-xl text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
        onClick={onPlay}
        title="Run Workflow"
      >
        <Play className="h-4 w-4 fill-current" />
      </Button>

      <div className="mx-1 h-5 w-px bg-white/10" />

      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-xl transition-all ${
          canUndo
            ? "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            : "text-muted-foreground/30 cursor-not-allowed"
        }`}
        onClick={canUndo ? onUndo : undefined}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-xl transition-all ${
          canRedo
            ? "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            : "text-muted-foreground/30 cursor-not-allowed"
        }`}
        onClick={canRedo ? onRedo : undefined}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}
