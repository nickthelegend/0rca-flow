"use client"

import { useState } from "react"
import { X, ArrowRight, ArrowLeft, Bot, Sparkles, Brain, FileText, Users, Zap, Check } from "lucide-react"
import { usePrivyWallet } from "@/hooks/use-privy-wallet"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type CreateAgentModalProps = {
  onClose: () => void
  onCreate: (agentId: string) => void
}

const agentCategories = [
  {
    id: "Research",
    name: "Research Agent",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    description: "Gather and analyze information",
  },
  {
    id: "Content",
    name: "Content Agent",
    icon: FileText,
    color: "from-violet-500 to-purple-500",
    description: "Generate and edit content",
  },
  {
    id: "Data",
    name: "Data Agent",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    description: "Process and transform data",
  },
  {
    id: "Customer",
    name: "Customer Agent",
    icon: Users,
    color: "from-orange-500 to-amber-500",
    description: "Handle customer interactions",
  },
]

const agentModels = [
  { id: "openai/gpt-5", name: "GPT-5", provider: "OpenAI", description: "Most capable model" },
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    description: "Fast and intelligent",
  },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI", description: "Fast and efficient" },
  { id: "anthropic/claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", description: "Most powerful" },
]

const agentTools = [
  { id: "web_search", name: "Web Search", description: "Search the internet" },
  { id: "code_interpreter", name: "Code Interpreter", description: "Execute code" },
  { id: "file_search", name: "File Search", description: "Search documents" },
  { id: "image_generation", name: "Image Generation", description: "Create images" },
  { id: "browser", name: "Browser", description: "Browse websites" },
  { id: "api_caller", name: "API Caller", description: "Make API requests" },
]

export function CreateAgentModal({ onClose, onCreate }: CreateAgentModalProps) {
  const { walletAddress } = usePrivyWallet()
  const [step, setStep] = useState(1)
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>("openai/gpt-5")
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [systemPrompt, setSystemPrompt] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    setIsCreating(true)
    const agentId = `agent-${Date.now()}`

    try {
      const { error } = await supabase
        .from("agent_workflows")
        .insert({
          id: agentId,
          wallet_address: walletAddress,
          name: agentName || "Untitled Agent",
          description: agentDescription,
          category: selectedCategory,
          model: selectedModel,
          system_prompt: systemPrompt,
          tools: selectedTools,
          nodes: [
            {
              id: "1",
              type: "agentCore",
              position: { x: 400, y: 200 },
              data: { name: agentName || "AI Agent", model: selectedModel, description: agentDescription },
            },
          ],
          edges: [],
        })

      if (error) throw error
      onCreate(agentId)
    } catch (error) {
      console.error("Error creating agent:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="w-[600px] max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f17] shadow-2xl shadow-violet-500/10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative border-b border-white/5 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create AI Agent</h2>
                <p className="text-sm text-white/50">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-white/10"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Agent Name</label>
                <Input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g., Research Assistant"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <Textarea
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  placeholder="What does this agent do?"
                  className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">Agent Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {agentCategories.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${selectedCategory === cat.id
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-medium text-white">{cat.name}</h4>
                        <p className="text-xs text-white/50 mt-1">{cat.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">Select AI Model</label>
                <div className="space-y-2">
                  {agentModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selectedModel === model.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                    >
                      <div>
                        <h4 className="font-medium text-white">{model.name}</h4>
                        <p className="text-xs text-white/50">
                          {model.provider} - {model.description}
                        </p>
                      </div>
                      {selectedModel === model.id && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">Select Tools</label>
                <div className="grid grid-cols-2 gap-2">
                  {agentTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${selectedTools.includes(tool.id)
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                    >
                      <h4 className="font-medium text-white text-sm">{tool.name}</h4>
                      <p className="text-xs text-white/50">{tool.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">System Prompt</label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Define the agent's behavior, personality, and instructions..."
                  className="bg-white/5 border-white/10 text-white min-h-[200px] rounded-xl resize-none font-mono text-sm"
                />
              </div>

              {/* Summary */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Agent Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Name</span>
                    <span className="text-white">{agentName || "Untitled"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Type</span>
                    <span className="text-white">{selectedCategory || "General"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Model</span>
                    <span className="text-white">{agentModels.find((m) => m.id === selectedModel)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Tools</span>
                    <span className="text-white">{selectedTools.length} selected</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 p-6 flex justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isCreating ? "Creating..." : "Create Agent"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
