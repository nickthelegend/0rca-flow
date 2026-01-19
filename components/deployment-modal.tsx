"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Rocket,
    CheckCircle2,
    ExternalLink,
    Terminal,
    Loader2,
    X,
    Globe,
    ShieldCheck,
    Cpu,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface DeploymentModalProps {
    isOpen: boolean
    onClose: () => void
    deploymentData: {
        agentId: string
        deploymentId: string
        url: string
        message: string
    } | null
}

export function DeploymentModal({ isOpen, onClose, deploymentData }: DeploymentModalProps) {
    const [progress, setProgress] = useState(0)
    const [step, setStep] = useState(0)

    // Simulation of build steps
    const steps = [
        "Generating sovereign agent code...",
        "Packaging dependencies and Procfile...",
        "Connecting to 0rca Cluster...",
        "Provisioning Kubernetes namespace...",
        "Handover to Cloud Builder successful!"
    ]

    useEffect(() => {
        if (isOpen) {
            setProgress(0)
            setStep(0)
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    const next = prev + Math.random() * 15
                    // Advance steps based on progress
                    if (next > 20 && step === 0) setStep(1)
                    if (next > 40 && step === 1) setStep(2)
                    if (next > 60 && step === 2) setStep(3)
                    if (next > 80 && step === 3) setStep(4)
                    return next
                })
            }, 400)
            return () => clearInterval(interval)
        }
    }, [isOpen])

    if (!isOpen || !deploymentData) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    {...({
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                    } as any)}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div
                    {...({
                        initial: { scale: 0.9, opacity: 0, y: 20 },
                        animate: { scale: 1, opacity: 1, y: 0 },
                        exit: { scale: 0.9, opacity: 0, y: 20 },
                    } as any)}
                    className="relative w-full max-w-md bg-[#0f0f1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-br from-emerald-600/20 to-teal-900/40 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <div className="relative flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center mb-2">
                                {progress < 100 ? (
                                    <Rocket className="w-8 h-8 text-white animate-bounce" />
                                ) : (
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white mb-2">
                                {progress < 100 ? "Dispatching Agent..." : "Mission Successful!"}
                            </h2>
                            <p className="text-sm text-white/40 font-mono tracking-tight lowercase">
                                ID: {deploymentData.agentId}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                                <span>Deployment Progress</span>
                                <span className="text-emerald-400">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5 bg-white/5" indicatorClassName="bg-emerald-500" />
                            <div className="flex items-center gap-2 text-xs text-white/60 italic animate-pulse">
                                <Terminal className="w-3 h-3" />
                                {steps[step]}
                            </div>
                        </div>

                        {progress === 100 && (
                            <motion.div
                                {...({
                                    initial: { opacity: 0, y: 10 },
                                    animate: { opacity: 1, y: 0 },
                                } as any)}
                                className="space-y-4 pt-4 border-t border-white/5"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                            <Globe className="w-3 h-3" />
                                            Endpoint
                                        </div>
                                        <p className="text-[10px] text-emerald-400 font-mono truncate">{deploymentData.url.replace('https://', '')}</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                            <ShieldCheck className="w-3 h-3" />
                                            Security
                                        </div>
                                        <p className="text-[10px] text-emerald-400 font-mono">mTLS & RBAC</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-2xl gap-2 shadow-lg shadow-emerald-500/20"
                                        onClick={() => window.open(deploymentData.url, '_blank')}
                                    >
                                        Visit Agent Terminal
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-white/40 hover:text-white"
                                        onClick={onClose}
                                    >
                                        Back to Workspace
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {progress < 100 && (
                            <div className="flex justify-center gap-8 py-4 opacity-20">
                                <Cpu className="w-5 h-5 text-white animate-spin" />
                                <Terminal className="w-5 h-5 text-white animate-pulse" />
                                <Globe className="w-5 h-5 text-white animate-bounce" />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
