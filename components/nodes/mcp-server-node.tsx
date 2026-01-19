"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Server, Globe, Search, Play, Settings, RefreshCw, Layers } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getStatusColor } from "@/lib/node-utils"
import { NodeControls } from "./node-controls"
import { Button } from "@/components/ui/button"

export type McpServerNodeData = {
    url: string
    name?: string
    tools?: any[]
    status?: "idle" | "running" | "completed" | "error"
    onAddNode?: (type: string, sourceNodeId: string) => void
    onDeleteNode?: (nodeId: string) => void
    onDuplicateNode?: (nodeId: string) => void
    onCopyNode?: (nodeId: string) => void
    hasOutgoingConnection?: boolean
    [key: string]: any
}

function McpServerNode({ id, data, selected }: NodeProps) {
    const nodeData = data as McpServerNodeData
    const status = nodeData.status || "idle"
    const [isHovered, setIsHovered] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleFetchTools = async () => {
        if (!nodeData.url) return
        setIsRefreshing(true)
        try {
            // In a real-world scenario, we'd call an internal API that proxies the MCP request
            console.log(`[MCP] Syncing tool manifest from ${nodeData.url}...`)

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800))

            // Mock tools for demonstration
            const mockTools = [
                { name: "web_search", description: "Search the decentralized web for real-time information" },
                { name: "wallet_query", description: "Retrieve multi-chain balances and transaction history" },
                { name: "tx_execute", description: "Submit secure transactions on supported networks" }
            ]

            // If we have an actual endpoint, we'd fetch it here.
            // For now we'll just simulate a successful retrieval if the URL looks like a URL.
        } catch (e) {
            console.error("MCP Fetch Error:", e)
        } finally {
            setIsRefreshing(false)
        }
    }

    return (
        <NodeControls
            nodeId={id}
            nodeName="MCP Gateway"
            nodeDescription="Standardized Model Context Protocol Interface"
            nodeIcon={<Server className="h-3 w-3 text-white" />}
            nodeColor="bg-blue-600"
            selected={selected}
            isHovered={isHovered}
            hasOutgoingConnection={nodeData.hasOutgoingConnection}
            onAddNode={nodeData.onAddNode}
            onDeleteNode={nodeData.onDeleteNode}
            onDuplicateNode={nodeData.onDuplicateNode}
            onCopyNode={nodeData.onCopyNode}
        >
            <Card
                className={`min-w-[280px] max-w-[320px] border-2 bg-[#09090b]/95 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl ${selected ? "border-blue-500/50 shadow-blue-500/20" : "border-white/5 hover:border-blue-500/30"}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Header with animated pulse */}
                <div className="relative h-1 bg-blue-600/20 w-full overflow-hidden">
                    {nodeData.url && <div className="absolute top-0 bottom-0 left-0 w-24 bg-blue-500 blur-sm animate-pulse" />}
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-blue-600/[0.03] border-b border-white/5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/40 border border-blue-400/20">
                        <Server className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-white tracking-tight uppercase tracking-widest text-[11px]">MCP Gateway</h3>
                        <p className="text-[9px] text-blue-400 font-mono flex items-center gap-1.5 uppercase tracking-tighter truncate">
                            {nodeData.url ? new URL(nodeData.url).hostname : "unconfigured.local"}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-white/20 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        onClick={handleFetchTools}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </Button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Active Connection Port */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 group transition-colors hover:bg-white/[0.04]">
                        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${nodeData.url ? "bg-emerald-500 shadow-emerald-500/50 animate-pulse" : "bg-red-500 shadow-red-500/50"}`} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Protocol Sync</p>
                                <div className="flex gap-1">
                                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">{nodeData.transport || 'HTTP'}</span>
                                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase">{nodeData.authMethod || 'NONE'}</span>
                                </div>
                            </div>
                            <p className="text-[11px] text-white/80 font-mono truncate">{nodeData.url || "ws://offline..."}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Exposed Tools</span>
                            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{(nodeData.tools || []).length} API</span>
                        </div>

                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                            {nodeData.tools && nodeData.tools.length > 0 ? (
                                nodeData.tools.map((tool: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.05] transition-all group">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Layers className="w-3 h-3 text-blue-500/60" />
                                            <span className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors truncate">{tool.name}</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-blue-500 transition-colors" />
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                                    <p className="text-[9px] text-white/20 uppercase font-black text-center tracking-widest">Waiting for Handshake</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Handles with better styling */}
                <Handle
                    type="target"
                    position={Position.Left}
                    id="input"
                    className="!w-3 !h-3 !bg-blue-600 !border-2 !border-blue-400 !-left-1.5 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="tool"
                    className="!w-3 !h-3 !bg-blue-600 !border-2 !border-blue-400 !-right-1.5 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                />
            </Card>
        </NodeControls>
    )
}

export default memo(McpServerNode)
