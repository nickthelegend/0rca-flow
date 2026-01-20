"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShieldCheck,
    CheckCircle2,
    ExternalLink,
    Terminal,
    Loader2,
    X,
    Globe,
    Cpu,
    Wallet,
    CreditCard,
    FileCode
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export type RegistrationStep = 'idle' | 'commission' | 'deploy_contract' | 'register_identity' | 'success' | 'error'

interface RegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    step: RegistrationStep
    txHashes: {
        commission?: string
        deployment?: string
        registration?: string
    }
    agentContractAddress?: string
    error?: string
}

export function RegistrationModal({ isOpen, onClose, step, txHashes, agentContractAddress, error }: RegistrationModalProps) {
    const [progress, setProgress] = useState(0)

    const steps = [
        { id: 'commission', label: 'Payment (1 CRO)', icon: CreditCard },
        { id: 'deploy_contract', label: 'Deploying Wallet', icon: FileCode },
        { id: 'register_identity', label: 'Identity Registry', icon: ShieldCheck }
    ]

    useEffect(() => {
        if (isOpen) {
            if (step === 'commission') setProgress(20)
            if (step === 'deploy_contract') setProgress(50)
            if (step === 'register_identity') setProgress(80)
            if (step === 'success') setProgress(100)
        }
    }, [isOpen, step])

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <motion.div
                    {...({
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                        onClick: step === 'success' || step === 'error' ? onClose : undefined,
                        className: "absolute inset-0 bg-black/80 backdrop-blur-md"
                    } as any)}
                />

                <motion.div
                    {...({
                        initial: { scale: 0.9, opacity: 0, y: 20 },
                        animate: { scale: 1, opacity: 1, y: 0 },
                        exit: { scale: 0.9, opacity: 0, y: 20 },
                        className: "relative w-full max-w-md bg-[#0f0f1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    } as any)}
                >
                    <div className="relative h-32 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <div className="relative flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center mb-2">
                                {step === 'success' ? (
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                ) : step === 'error' ? (
                                    <X className="w-8 h-8 text-white" />
                                ) : (
                                    <ShieldCheck className="w-8 h-8 text-white animate-pulse" />
                                )}
                            </div>
                        </div>
                        {(step === 'success' || step === 'error') && (
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white mb-2">
                                {step === 'success' ? "Agent Registered!" : step === 'error' ? "Registration Failed" : "On-Chain Protocol"}
                            </h2>
                            <p className="text-sm text-white/40">
                                Establishing presence on Cronos Testnet
                            </p>
                        </div>

                        {step === 'error' ? (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                                {error}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Progress value={progress} className="h-1.5 bg-white/5" indicatorClassName="bg-blue-500" />
                                    <div className="grid grid-cols-3 gap-2">
                                        {steps.map((s, idx) => {
                                            const Icon = s.icon
                                            const isActive = step === s.id
                                            const isDone = progress > (idx === 0 ? 20 : idx === 1 ? 50 : 80)
                                            return (
                                                <div key={s.id} className="flex flex-col items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${isDone ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" :
                                                        isActive ? "bg-blue-500/20 border-blue-500/50 text-blue-400 animate-pulse" :
                                                            "bg-white/5 border-white/5 text-white/20"
                                                        }`}>
                                                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                                    </div>
                                                    <span className={`text-[8px] font-bold uppercase tracking-tighter ${isDone || isActive ? "text-white/60" : "text-white/20"
                                                        }`}>{s.label}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {txHashes.commission && (
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                        <CreditCard className="w-3 h-3" />
                                                        Commission Paid
                                                    </div>
                                                    <button onClick={() => window.open(`https://explorer.cronos.org/testnet/tx/${txHashes.commission}`, '_blank')} className="text-[9px] text-blue-400 hover:underline">View</button>
                                                </div>
                                            </div>

                                            {agentContractAddress && (
                                                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                            <Cpu className="w-3 h-3" />
                                                            Agent Contract
                                                        </div>
                                                        <button onClick={() => window.open(`https://explorer.cronos.org/testnet/address/${agentContractAddress}`, '_blank')} className="text-[9px] text-blue-400 hover:underline truncate max-w-[100px]">{agentContractAddress}</button>
                                                    </div>
                                                </div>
                                            )}

                                            {txHashes.registration && (
                                                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                            <ShieldCheck className="w-3 h-3" />
                                                            On-Chain Identity
                                                        </div>
                                                        <button onClick={() => window.open(`https://explorer.cronos.org/testnet/tx/${txHashes.registration}`, '_blank')} className="text-[9px] text-blue-400 hover:underline">Verified</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 'success' && (
                            <Button
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 rounded-2xl gap-2 shadow-lg shadow-blue-500/20"
                                onClick={onClose}
                            >
                                Return to Builder
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        )}

                        {step === 'error' && (
                            <Button
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-6 rounded-2xl gap-2"
                                onClick={onClose}
                            >
                                Dismiss
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
