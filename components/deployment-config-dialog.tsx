"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Key } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type EnvVar = {
    key: string
    value: string
}

export type DeploymentConfig = {
    envVars: EnvVar[]
}

type DeploymentConfigDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onDeploy: (config: DeploymentConfig) => void
    isDeploying?: boolean
}

const COMMON_PROVIDERS = [
    { name: "OpenAI", key: "OPENAI_API_KEY", color: "bg-green-500/10 text-green-500 hover:bg-green-500/20" },
    { name: "Google Gemini", key: "GOOGLE_API_KEY", color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
    { name: "Anthropic", key: "ANTHROPIC_API_KEY", color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" },
    { name: "Mistral", key: "MISTRAL_API_KEY", color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
    { name: "CrewAI", key: "CREWAI_API_KEY", color: "bg-red-500/10 text-red-500 hover:bg-red-500/20" },
    { name: "Supabase", key: "SUPABASE_URL", color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" },
    { name: "Supabase Key", key: "SUPABASE_KEY", color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" },
]

export function DeploymentConfigDialog({ open, onOpenChange, onDeploy, isDeploying = false }: DeploymentConfigDialogProps) {
    const [envVars, setEnvVars] = useState<EnvVar[]>([
        { key: "OPENAI_API_KEY", value: "" }
    ])

    const handleAddEnvVar = (key = "", value = "") => {
        setEnvVars([...envVars, { key, value }])
    }

    const handleRemoveEnvVar = (index: number) => {
        const newEnvVars = [...envVars]
        newEnvVars.splice(index, 1)
        setEnvVars(newEnvVars)
    }

    const handleUpdateEnvVar = (index: number, field: "key" | "value", value: string) => {
        const newEnvVars = [...envVars]
        newEnvVars[index][field] = value
        setEnvVars(newEnvVars)
    }

    const handleAddProvider = (key: string) => {
        // Check if already exists
        if (envVars.some(e => e.key === key)) return
        handleAddEnvVar(key, "")
    }

    const handleDeployClick = () => {
        // Filter out empty keys
        const validEnvVars = envVars.filter(e => e.key.trim() !== "")
        onDeploy({ envVars: validEnvVars })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-[#0a0a0f] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Configure Deployment</DialogTitle>
                    <DialogDescription className="text-white/60">
                        Set up environment variables and keys for your agent. These will be securely injected during deployment.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-6 py-4">

                    {/* Quick Add Providers */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-white/80">Quick Add Keys</Label>
                        <div className="flex flex-wrap gap-2">
                            {COMMON_PROVIDERS.map((provider) => (
                                <button
                                    key={provider.key}
                                    onClick={() => handleAddProvider(provider.key)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 border border-white/5 ${provider.color}`}
                                >
                                    <Key className="w-3 h-3" />
                                    {provider.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Env Vars List */}
                    <div className="flex-1 flex flex-col min-h-0 space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-white/80">Environment Variables</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddEnvVar()}
                                className="h-8 text-xs border-white/10 hover:bg-white/5 hover:text-white"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Variable
                            </Button>
                        </div>

                        <Card className="flex-1 bg-black/20 border-white/5 overflow-hidden">
                            <ScrollArea className="h-full max-h-[300px] p-4">
                                <div className="space-y-3">
                                    {envVars.length === 0 ? (
                                        <div className="py-8 text-center text-white/30 text-sm">
                                            No environment variables set.
                                        </div>
                                    ) : (
                                        envVars.map((envVar, index) => (
                                            <div key={index} className="flex gap-3 group items-start">
                                                <div className="flex-1 space-y-1">
                                                    <Input
                                                        placeholder="KEY"
                                                        value={envVar.key}
                                                        onChange={(e) => handleUpdateEnvVar(index, "key", e.target.value)}
                                                        className="bg-white/5 border-white/10 text-xs font-mono"
                                                    />
                                                </div>
                                                <div className="flex-[1.5] space-y-1">
                                                    <Input
                                                        placeholder="VALUE"
                                                        value={envVar.value}
                                                        onChange={(e) => handleUpdateEnvVar(index, "value", e.target.value)}
                                                        type="password"
                                                        className="bg-white/5 border-white/10 text-xs font-mono"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveEnvVar(index)}
                                                    className="h-9 w-9 text-white/30 hover:text-red-400 hover:bg-white/5"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>
                    </div>
                </div>

                <DialogFooter className="border-t border-white/10 pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="hover:bg-white/5 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeployClick}
                        disabled={isDeploying}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white min-w-[100px]"
                    >
                        {isDeploying ? "Deploying..." : "Deploy Agent"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
