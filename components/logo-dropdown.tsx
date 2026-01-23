"use client"

import { useState, useRef, useEffect } from "react"
import {
  Plus,
  Copy,
  Clock,
  Home,
  Layers,
  FolderOpen,
  Cpu,
  Code2,
  Settings,
  LogOut,
  ChevronDown,
  Lock,
} from "lucide-react"

type LogoDropdownProps = {
  onCreateAgent?: () => void
  onDuplicate?: () => void
  onHome?: () => void
  onSignOut?: () => void
  onOpenChange?: (isOpen: boolean) => void
}

export function LogoDropdown({ onCreateAgent, onDuplicate, onHome, onSignOut, onOpenChange }: LogoDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const menuItems = [
    {
      type: "action",
      icon: Plus,
      label: "Create New AI Agent",
      onClick: onCreateAgent,
      highlight: true,
    },
    {
      type: "action",
      icon: Copy,
      label: "Duplicate Agent",
      onClick: onDuplicate,
    },
    {
      type: "action",
      icon: Clock,
      label: "Recent Agents",
      onClick: () => { },
    },
    { type: "divider" },
    {
      type: "action",
      icon: Home,
      label: "Home",
      onClick: onHome,
    },
    {
      type: "action",
      icon: Layers,
      label: "Agents",
      onClick: () => { },
    },
    {
      type: "action",
      icon: FolderOpen,
      label: "Library",
      onClick: () => { },
    },
    {
      type: "action",
      icon: Cpu,
      label: "Engine",
      locked: true,
      onClick: () => { },
    },
    {
      type: "action",
      icon: Code2,
      label: "Automation",
      locked: true,
      onClick: () => { },
    },
    { type: "divider" },
    {
      type: "action",
      icon: Settings,
      label: "Settings",
      onClick: () => { },
    },
    {
      type: "action",
      icon: LogOut,
      label: "Sign Out",
      onClick: onSignOut,
    },
  ]

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all hover:bg-white/5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden shadow-lg shadow-violet-500/20">
          <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 origin-top-left animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-popover/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="p-1.5">
              {menuItems.map((item, index) => {
                if (item.type === "divider") {
                  return <div key={index} className="my-1.5 h-px bg-white/5" />
                }

                const Icon = item.icon!
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.()
                      setIsOpen(false)
                    }}
                    disabled={item.locked}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${item.highlight
                      ? "text-violet-400 hover:bg-violet-500/10"
                      : item.locked
                        ? "cursor-not-allowed text-muted-foreground/50"
                        : "text-foreground hover:bg-white/5"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                    {item.locked && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Upgrade
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
