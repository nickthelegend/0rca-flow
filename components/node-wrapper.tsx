"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Play, ChevronRight, MoreVertical, Copy, Trash2, GripVertical } from "lucide-react"

type NodeWrapperProps = {
  children: React.ReactNode
  nodeId: string
  nodeName: string
  nodeDescription: string
  nodeIcon: React.ReactNode
  nodeColor: string
  selected?: boolean
  hasOutgoingConnection?: boolean
  onAddNode?: (type: string, sourceNodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onDuplicateNode?: (nodeId: string) => void
  onCopyNode?: (nodeId: string) => void
}

export function NodeWrapper({
  children,
  nodeId,
  nodeName,
  nodeDescription,
  nodeIcon,
  nodeColor,
  selected,
  hasOutgoingConnection = false,
  onAddNode,
  onDeleteNode,
  onDuplicateNode,
  onCopyNode,
}: NodeWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }, [])

  const handleMoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect()
      setContextMenuPosition({ x: rect.left + rect.width / 2 - 80, y: rect.top - 10 })
    }
    setShowContextMenu(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false)
      }
    }
    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showContextMenu])

  return (
    <div
      ref={nodeRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleContextMenu}
    >
      {/* Floating Toolbar - Shows when selected */}
      {selected && (
        <div className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-card/95 px-2 py-1.5 shadow-xl backdrop-blur-xl">
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              title="Run this node"
            >
              <Play className="h-3.5 w-3.5" />
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              title="Run from here"
            >
              <div className="flex items-center">
                <Play className="h-3 w-3" />
                <ChevronRight className="-ml-1 h-3 w-3" />
              </div>
            </button>
            <div className="mx-1 h-4 w-px bg-white/10" />
            <button
              onClick={handleMoreClick}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              title="More options"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-[100] animate-in fade-in-0 zoom-in-95 duration-150"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <div className="min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-popover/95 py-1 shadow-xl backdrop-blur-xl">
            <button
              onClick={() => {
                onCopyNode?.(nodeId)
                setShowContextMenu(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
              Copy to clipboard
            </button>
            <button
              onClick={() => {
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
              onClick={() => {
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

      {/* Hover Tooltip - Shows node details on hover */}
      {isHovered && !selected && (
        <div className="absolute -top-16 left-1/2 z-40 -translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-1 duration-150">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-xl">
            <div className={`flex h-6 w-6 items-center justify-center rounded ${nodeColor}`}>{nodeIcon}</div>
            <div>
              <p className="text-xs font-medium text-foreground">{nodeName}</p>
              <p className="text-[10px] text-muted-foreground">{nodeDescription}</p>
            </div>
          </div>
        </div>
      )}

      {/* Node Content */}
      {children}
    </div>
  )
}
