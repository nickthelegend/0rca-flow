"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Globe, Lock, Upload } from "lucide-react"

type ShareDropdownProps = {
    onPublish?: (visibility: "public" | "private") => void
}

export function ShareDropdown({ onPublish }: ShareDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [visibility, setVisibility] = useState<"public" | "private">("public")

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                className={`text-white/70 hover:text-white hover:bg-white/10 ${isOpen ? "bg-white/10 text-white" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Share2 className="w-4 h-4 mr-2" />
                Share
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-72 z-50 origin-top-right animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                        <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl p-4">
                            <h3 className="text-sm font-medium text-white mb-3">Share Workflow</h3>

                            <div className="space-y-2 mb-4">
                                <button
                                    onClick={() => setVisibility("public")}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${visibility === "public"
                                            ? "bg-violet-500/10 border-violet-500/50 text-violet-200"
                                            : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${visibility === "public" ? "bg-violet-500/20" : "bg-white/10"}`}>
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-medium">Public Community</div>
                                        <div className="text-xs opacity-70">Anyone can view and fork</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setVisibility("private")}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${visibility === "private"
                                            ? "bg-violet-500/10 border-violet-500/50 text-violet-200"
                                            : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${visibility === "private" ? "bg-violet-500/20" : "bg-white/10"}`}>
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-medium">Private</div>
                                        <div className="text-xs opacity-70">Only you can access</div>
                                    </div>
                                </button>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                                onClick={() => {
                                    onPublish?.(visibility)
                                    setIsOpen(false)
                                }}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Publish to {visibility === "public" ? "Community" : "Private Library"}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
