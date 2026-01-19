"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Wallet, Key, ShieldCheck, RefreshCw, Copy, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { NodeControls } from "./node-controls"
import { Button } from "@/components/ui/button"

export type WalletNodeData = {
    address?: string
    privateKey?: string
    network?: string
    onAddNode?: (type: string, sourceNodeId: string) => void
    onDeleteNode?: (nodeId: string) => void
    onDuplicateNode?: (nodeId: string) => void
    onCopyNode?: (nodeId: string) => void
    [key: string]: any
}

function WalletNode({ id, data, selected }: NodeProps) {
    const nodeData = data as WalletNodeData
    const [isHovered, setIsHovered] = useState(false)
    const [copied, setCopied] = useState(false)

    const copyAddress = () => {
        if (nodeData.address) {
            navigator.clipboard.writeText(nodeData.address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <NodeControls
            nodeId={id}
            nodeName="Safe Wallet"
            nodeDescription="Secure on-chain identity and transaction signer"
            nodeIcon={<Wallet className="h-3 w-3 text-white" />}
            nodeColor="bg-orange-500"
            selected={selected}
            isHovered={isHovered}
            onAddNode={nodeData.onAddNode}
            onDeleteNode={nodeData.onDeleteNode}
            onDuplicateNode={nodeData.onDuplicateNode}
            onCopyNode={nodeData.onCopyNode}
        >
            <Card
                className={`min-w-[240px] border-2 bg-black/90 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl ${selected ? "border-orange-500/50 shadow-orange-500/20" : "border-white/5 hover:border-orange-500/30"
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/[0.03] border-b border-orange-500/10">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 shadow-lg shadow-orange-900/40 border border-orange-300/20">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] font-black text-white tracking-widest uppercase">Agent Wallet</h3>
                        <p className="text-[8px] text-orange-400 font-mono tracking-tighter uppercase">{nodeData.network || "EVM MAINNET"}</p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Live Address</span>
                            <button onClick={copyAddress} className="text-white/20 hover:text-orange-400 transition-colors">
                                {copied ? <Check size={10} /> : <Copy size={10} />}
                            </button>
                        </div>
                        <div className="p-2 rounded-xl bg-orange-500/5 border border-orange-500/10 font-mono text-[10px] text-orange-200/80 break-all leading-tight">
                            {nodeData.address || "0x0000...0000"}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[8px] font-bold text-white/40 uppercase">Key Encrypted & Secured</span>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="wallet"
                    className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-300 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                />
            </Card>
        </NodeControls>
    )
}

export default memo(WalletNode)
