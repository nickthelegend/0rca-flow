"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Play, ChevronRight, MoreVertical, Copy, Trash2, GripVertical } from "lucide-react"

type NodeControlsProps = {
  nodeId: string
  nodeName: string
  nodeDescription: string
  nodeIcon?: React.ReactNode
  nodeColor?: string
  selected?: boolean
  isHovered?: boolean
  hasOutgoingConnection?: boolean
  onAddNode?: (type: string, sourceNodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onDuplicateNode?: (nodeId: string) => void
  onCopyNode?: (nodeId: string) => void
  children: React.ReactNode
}

export function NodeControls({
  nodeId,
  nodeName,
  nodeDescription,
  nodeIcon,
  nodeColor = "bg-primary",
  selected,
  isHovered: externalIsHovered,
  onDeleteNode,
  onDuplicateNode,
  onCopyNode,
  children,
}: NodeControlsProps) {
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [internalIsHovered, setInternalIsHovered] = useState(false)

  const isHovered = externalIsHovered ?? internalIsHovered

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowContextMenu(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={() => setInternalIsHovered(true)}
      onMouseLeave={() => setInternalIsHovered(false)}
    >
      {/* Floating Toolbar */}
      {selected && (
        <div className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#1a1a25]/95 px-2 py-1.5 shadow-xl backdrop-blur-xl">
            <button className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
              <Play className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
              <div className="flex items-center">
                <Play className="h-3 w-3" />
                <ChevronRight className="-ml-1 h-3 w-3" />
              </div>
            </button>
            <div className="mx-1 h-4 w-px bg-white/10" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowContextMenu(!showContextMenu)
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Context Menu */}
          {showContextMenu && (
            <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-[100]">
              <div className="min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-[#1a1a25]/98 py-1 shadow-xl backdrop-blur-xl">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCopyNode?.(nodeId)
                    setShowContextMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  Copy to clipboard
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicateNode?.(nodeId)
                    setShowContextMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  Duplicate
                </button>
                <div className="my-1 h-px bg-white/10" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteNode?.(nodeId)
                    setShowContextMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hover Tooltip */}
      {isHovered && !selected && (
        <div className="absolute -top-14 left-1/2 z-40 -translate-x-1/2 animate-in fade-in-0 duration-150 pointer-events-none">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a25]/95 px-3 py-2 shadow-lg backdrop-blur-xl whitespace-nowrap">
            {nodeIcon && (
              <div className={`flex h-6 w-6 items-center justify-center rounded ${nodeColor}`}>{nodeIcon}</div>
            )}
            <div>
              <p className="text-xs font-medium text-foreground">{nodeName}</p>
              <p className="text-[10px] text-muted-foreground">{nodeDescription}</p>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
