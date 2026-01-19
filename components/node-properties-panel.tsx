"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchMcpTools } from "@/lib/mcp-actions"
import { X, ChevronRight, Trash2, Shield, Brain, BookOpen, FileOutput, Settings2, Sparkles, MessageSquare, Wrench, Info, Zap, Database, Cpu, History, Search, Lock, Key, Fingerprint, Target, Trophy, Server, Globe, Clock, MessageCircle, Hash, RefreshCw, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type NodePropertiesPanelProps = {
  node: {
    id: string
    type: string
    data: Record<string, any>
  } | null
  onClose: () => void
  onUpdateNodeData: (nodeId: string, data: Record<string, any>) => void
  onDeleteNode?: (nodeId: string) => void
}

const nodeInfo: Record<string, { name: string; description: string; icon: any; color: string; theme: string }> = {
  textModel: {
    name: "Text Model",
    description: "Generate intelligent text using state-of-the-art LLMs.",
    icon: MessageSquare,
    color: "from-violet-500 to-purple-500",
    theme: "#8b5cf6",
  },
  embeddingModel: {
    name: "Embedding Model",
    description: "Multi-dimensional vectorization for semantic intelligence.",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    theme: "#06b6d4",
  },
  prompt: {
    name: "Prompt Template",
    description: "Structure complex instructions with dynamic variable injection.",
    icon: FileOutput,
    color: "from-pink-500 to-rose-500",
    theme: "#f43f5e",
  },
  imageGeneration: {
    name: "Image Studio",
    description: "Synthesize high-fidelity visuals from descriptive text.",
    icon: Sparkles,
    color: "from-amber-500 to-orange-500",
    theme: "#f59e0b",
  },
  audio: {
    name: "Audio Synthesis",
    description: "High-fidelity text-to-speech and vocal cloning.",
    icon: Sparkles,
    color: "from-red-500 to-orange-500",
    theme: "#ef4444",
  },
  javascript: {
    name: "Logic Engine",
    description: "Execute sandboxed JavaScript for complex data transformations.",
    icon: Cpu,
    color: "from-yellow-500 to-amber-500",
    theme: "#eab308",
  },
  tool: {
    name: "Custom Tool",
    description: "Extend agent capabilities with specialized functional tools.",
    icon: Wrench,
    color: "from-slate-500 to-zinc-500",
    theme: "#64748b",
  },
  structuredOutput: {
    name: "Schema Parser",
    description: "Enforce strict JSON schemas and data validation.",
    icon: Database,
    color: "from-emerald-500 to-teal-500",
    theme: "#10b981",
  },
  httpRequest: {
    name: "API Connector",
    description: "Synchronize with external systems via REST/GraphQL.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    theme: "#3b82f6",
  },
  conditional: {
    name: "Decision Node",
    description: "Complex branching logic based on multi-variate conditions.",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    theme: "#a855f7",
  },
  agentCore: {
    name: "Neural Core",
    description: "The primary orchestrator and autonomous decision engine.",
    icon: Brain,
    color: "from-emerald-500 to-teal-500",
    theme: "#10b981",
  },
  systemPrompt: {
    name: "Identity Protocol",
    description: "Define constraints, personality, and behavioral heuristics.",
    icon: FileOutput,
    color: "from-blue-500 to-indigo-500",
    theme: "#4f46e5",
  },
  toolsConfig: {
    name: "Toolbox Interface",
    description: "Manage integrated capabilities and API access rights.",
    icon: Wrench,
    color: "from-orange-500 to-amber-500",
    theme: "#f97316",
  },
  memory: {
    name: "Cognitive Storage",
    description: "Manage conversational state and historical retrievals.",
    icon: History,
    color: "from-purple-500 to-pink-500",
    theme: "#d946ef",
  },
  knowledgeBase: {
    name: "Semantic RAG",
    description: "Connect to live documentation and vector databases.",
    icon: BookOpen,
    color: "from-cyan-500 to-blue-500",
    theme: "#0ea5e9",
  },
  guardrails: {
    name: "Safety Shield",
    description: "Enforce compliance and content moderation layers.",
    icon: Shield,
    color: "from-red-500 to-rose-500",
    theme: "#f43f5e",
  },
  outputParser: {
    name: "Format Refiner",
    description: "Optimize and sanitize final agent outputs.",
    icon: FileOutput,
    color: "from-yellow-500 to-orange-500",
    theme: "#fbbf24",
  },
  mcpServer: {
    name: "MCP Gateway",
    description: "Connect and synchronize tools from Model Context Protocol servers.",
    icon: Server,
    color: "from-blue-600 to-indigo-600",
    theme: "#2563eb",
  },
  cron: {
    name: "Cron Scheduler",
    description: "Execute workflows on a precise recurring schedule.",
    icon: Clock,
    color: "from-amber-500 to-orange-600",
    theme: "#fbbf24",
  },
  telegram: {
    name: "Telegram Connector",
    description: "Enable automated messaging and command processing via Telegram.",
    icon: MessageCircle,
    color: "from-sky-500 to-blue-600",
    theme: "#0ea5e9",
  },
  intelligenceModel: {
    name: "Intelligence Gateway",
    description: "Select flagship models to power your agent's reasoning.",
    icon: Cpu,
    color: "from-violet-500 to-purple-600",
    theme: "#8b5cf6",
  },
  discord: {
    name: "Discord Webhook",
    description: "Send automated alerts and data logs to Discord channels.",
    icon: Hash,
    color: "from-[#5865F2] to-[#404EED]",
    theme: "#5865F2",
  },
}

const MotionDiv = motion.div as any

export function NodePropertiesPanel({ node: originalNode, onClose, onUpdateNodeData, onDeleteNode }: NodePropertiesPanelProps) {
  if (!originalNode) return null
  const node = originalNode

  const info = nodeInfo[node.type] || {
    name: node.type,
    description: "Advanced configuration for this functional node.",
    icon: Settings2,
    color: "from-gray-500 to-gray-600",
    theme: "#6b7280",
  }
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const updateData = (key: string, value: any) => {
    onUpdateNodeData(node.id, { ...node.data, [key]: value })
  }

  const handleSyncMcp = async () => {
    if (!node.data.url) {
      setSyncError("Please enter an MCP Server URL")
      return
    }

    setIsSyncing(true)
    setSyncError(null)

    try {
      const transportType = node.data.transport === "sse" ? "sse" : "http"
      const headers: Record<string, string> = {}

      if (node.data.authMethod === "API Key" && node.data.keyName && node.data.keyValue) {
        if (node.data.location === "Header") {
          headers[node.data.keyName] = node.data.keyValue
        }
      }

      const result = await fetchMcpTools(node.data.url, transportType as any, headers)

      if (result.success) {
        onUpdateNodeData(node.id, {
          ...node.data,
          tools: result.tools,
          status: "completed",
          lastSynced: new Date().toISOString()
        })
      } else {
        setSyncError(result.error || "Failed to connect to MCP server")
        updateData("status", "error")
      }
    } catch (err: any) {
      setSyncError(err.message || "An unexpected error occurred")
      updateData("status", "error")
    } finally {
      setIsSyncing(false)
    }
  }

  const renderFields = () => {
    switch (node.type) {
      case "textModel":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Intelligence Model</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Provider</Label>
                  <Select value={node.data.provider || "openai"} onValueChange={(v) => updateData("provider", v)}>
                    <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a25]/95 border-white/10">
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="groq">Groq</SelectItem>
                      <SelectItem value="mistral">Mistral Corp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Model</Label>
                  <Select value={node.data.model || "gpt-4o"} onValueChange={(v) => updateData("model", v)}>
                    <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a25]/95">
                      {node.data.provider === "openai" ? (
                        <>
                          <SelectItem value="gpt-4o">GPT-4o (Omni)</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="o1-preview">o1 Preview (Reasoning)</SelectItem>
                          <SelectItem value="o1-mini">o1 Mini</SelectItem>
                        </>
                      ) : node.data.provider === "google" ? (
                        <>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                          <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                          <SelectItem value="gemini-2.0-flash-exp">Gemini 2.0 Flash</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                          <SelectItem value="llama-3-70b">Llama 3 (70B)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-4 py-3 rounded-2xl bg-orange-500/5 border border-orange-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-3 h-3 text-orange-400" />
                <Label className="text-[10px] font-bold uppercase tracking-wider text-orange-400/80">API Credentials</Label>
              </div>
              <Input
                type="password"
                placeholder="sk-...."
                value={node.data.apiKey || ""}
                onChange={(e) => updateData("apiKey", e.target.value)}
                className="h-9 bg-black/20 border-white/5 text-xs rounded-lg focus:ring-orange-500/40"
              />
              <p className="text-[9px] text-white/30 italic mt-1 text-center">Encrypted at rest within the 0RCA Vault</p>
            </div>

            <div className="space-y-6 rounded-2xl bg-white/[0.02] p-4 border border-white/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-[11px] text-white/60">Creativity (Temp)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Info className="w-3 h-3 text-white/20" /></TooltipTrigger>
                        <TooltipContent>Controlled entropy for output variation.</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {node.data.temperature || 0.7}
                  </span>
                </div>
                <Slider
                  value={[node.data.temperature || 0.7]}
                  onValueChange={([v]) => updateData("temperature", v)}
                  min={0}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] text-white/60">Frequency Penalty</Label>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                    {node.data.frequency_penalty || 0}
                  </span>
                </div>
                <Slider
                  value={[node.data.frequency_penalty || 0]}
                  onValueChange={([v]) => updateData("frequency_penalty", v)}
                  min={-2}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="flex items-center justify-between p-1">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold text-white/80">Streaming</Label>
                  <p className="text-[9px] text-white/30 italic">Real-time token delivery</p>
                </div>
                <Switch
                  checked={node.data.streaming}
                  onCheckedChange={(v) => updateData("streaming", v)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>
          </div>
        )

      case "systemPrompt":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Persona & Behavioral Heuristics</Label>

              <div className="space-y-2">
                <Label className="text-[11px] text-white/60">Communication Tone</Label>
                <Select value={node.data.tone || "professional"} onValueChange={(v) => updateData("tone", v)}>
                  <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a25]/95 border-white/10">
                    <SelectItem value="professional">Formal & Expert</SelectItem>
                    <SelectItem value="concise">Concise & Technical</SelectItem>
                    <SelectItem value="creative">Witty & Creative</SelectItem>
                    <SelectItem value="empathetic">Supportive & Empathetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] text-white/60">Explicit Constraints</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "no_emojis", label: "No Emojis" },
                    { id: "no_preamble", label: "Direct Output (No Preamble)" },
                    { id: "short", label: "Atomic Responses" },
                    { id: "markdown", label: "Strict Markdown" }
                  ].map(c => (
                    <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <Switch
                        checked={(node.data.constraints || []).includes(c.id)}
                        onCheckedChange={(v) => {
                          const current = node.data.constraints || []
                          updateData("constraints", v ? [...current, c.id] : current.filter((id: string) => id !== c.id))
                        }}
                        className="scale-50 origin-left"
                      />
                      <span className="text-[9px] text-white/60 font-medium">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] text-white/60">System Instruction</Label>
                  <span className="text-[10px] font-mono text-white/20">{(node.data.content || "").length} symbols</span>
                </div>
                <Textarea
                  value={node.data.content || ""}
                  onChange={(e) => updateData("content", e.target.value)}
                  placeholder="You are an autonomous agent capable of..."
                  className="min-h-[180px] bg-white/[0.03] border-white/5 rounded-2xl text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        )

      case "prompt":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Instruction Protocol</Label>
                <span className="text-[10px] font-mono text-white/20">{(node.data.content || "").length}/32,000</span>
              </div>
              <Textarea
                value={node.data.content || ""}
                onChange={(e) => updateData("content", e.target.value)}
                placeholder="Direct the model's behavior..."
                className="min-h-[250px] resize-none border-white/5 bg-white/[0.03] text-sm leading-relaxed rounded-2xl focus:border-pink-500/30 transition-all custom-scrollbar px-5 py-4"
              />
              <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10 flex gap-3">
                <Zap className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-pink-400/80 leading-relaxed italic">
                  Inject global state or previous outputs using <span className="text-white bg-white/10 px-1 rounded">$variable</span> syntax for dynamic execution.
                </p>
              </div>
            </div>
          </div>
        )

      case "agentCore":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Autonomous Identity</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Identifier</Label>
                  <Input
                    value={node.data.name || ""}
                    onChange={(e) => updateData("name", e.target.value)}
                    placeholder="e.g. Cognitive Engine v1"
                    className="h-11 border-white/5 bg-white/[0.03] rounded-xl focus:border-emerald-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Core Purpose / Instructions</Label>
                  <Textarea
                    value={node.data.description || ""}
                    onChange={(e) => updateData("description", e.target.value)}
                    placeholder="Briefly state the agent's reason for existing..."
                    className="min-h-[160px] bg-white/[0.03] border-white/5 rounded-2xl p-4 resize-none text-xs focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-500/70 leading-relaxed italic">
                Connect an <span className="text-white font-bold">Intelligence Model</span> to the bottom handle of this node to enable reasoning.
              </p>
            </div>
          </div>
        )

      case "memory":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Temporal Settings</Label>
              <div className="space-y-2">
                <Label className="text-[11px] text-white/60">Retrieval Strategy</Label>
                <Select value={node.data.type || "conversation"} onValueChange={(v) => updateData("type", v)}>
                  <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a25]/95 border-white/10">
                    <SelectItem value="conversation">Continuous Context</SelectItem>
                    <SelectItem value="summary">Vector-based Recency</SelectItem>
                    <SelectItem value="buffer">Fixed Window Buffer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6 rounded-2xl bg-white/[0.02] p-5 border border-white/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] text-white/60">Lookback Depth</Label>
                  <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                    {node.data.maxMessages || 50} nodes
                  </span>
                </div>
                <Slider
                  value={[node.data.maxMessages || 50]}
                  onValueChange={([v]) => updateData("maxMessages", v)}
                  min={5}
                  max={1000}
                  step={5}
                />
              </div>

              <div className="flex items-center justify-between p-1">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-white/80 tracking-tight">Recursive Summary</Label>
                  <p className="text-[10px] text-white/30 leading-snug">Auto-compress history via LLM</p>
                </div>
                <Switch
                  checked={node.data.summarize}
                  onCheckedChange={(v) => updateData("summarize", v)}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </div>
          </div>
        )

      case "knowledgeBase":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Semantic Search Configuration</Label>
              <div className="space-y-2">
                <Label className="text-[11px] text-white/60">Vectorization Engine</Label>
                <Select
                  value={node.data.embeddingModel || "openai/text-embedding-3-small"}
                  onValueChange={(v) => updateData("embeddingModel", v)}
                >
                  <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a25]/95">
                    <SelectItem value="openai/text-embedding-3-small">OpenAI V3 Small (1536d)</SelectItem>
                    <SelectItem value="openai/text-embedding-3-large">OpenAI V3 Large (3072d)</SelectItem>
                    <SelectItem value="cohere/embed-english-v3">Cohere Multi-lingual V3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6 rounded-2xl bg-white/[0.02] p-5 border border-white/5">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/50">Chunking Strategy</Label>
                <Select value={node.data.chunkStrategy || "semantic"} onValueChange={(v) => updateData("chunkStrategy", v)}>
                  <SelectTrigger className="h-9 border-white/5 bg-black/20 rounded-lg text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a25]/95">
                    <SelectItem value="fixed">Fixed Size (Character)</SelectItem>
                    <SelectItem value="semantic">Semantic (Context Aware)</SelectItem>
                    <SelectItem value="recursive">Recursive Character</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] text-white/60">Search Threshold</Label>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                    {node.data.threshold || 0.7} sim
                  </span>
                </div>
                <Slider
                  value={[node.data.threshold || 0.7]}
                  onValueChange={([v]) => updateData("threshold", v)}
                  min={0.1}
                  max={0.99}
                  step={0.01}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] text-white/60">Context Overlap</Label>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                    {node.data.overlap || 200} chars
                  </span>
                </div>
                <Slider
                  value={[node.data.overlap || 200]}
                  onValueChange={([v]) => updateData("overlap", v)}
                  min={0}
                  max={1000}
                  step={50}
                />
              </div>
            </div>
          </div>
        )

      case "toolsConfig":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">System Capabilities</Label>
              <div className="space-y-3">
                {[
                  { id: "web", label: "Global Web Search", icon: Search, desc: "Real-time internet access for grounding" },
                  { id: "code", label: "Code Interpreter", icon: Cpu, desc: "Sandboxed execution for data & math" },
                  { id: "wiki", label: "Knowledge API", icon: BookOpen, desc: "Curated academic & historical facts" },
                  { id: "git", label: "VCS Integration", icon: Wrench, desc: "Read/Write access to code repositories" }
                ].map((tool) => (
                  <div key={tool.id} className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                          <tool.icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{tool.label}</span>
                          <p className="text-[9px] text-white/30">{tool.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={tool.id === "web" ? node.data.enableWebSearch : tool.id === "code" ? node.data.enableCodeInterpreter : (node.data.tools || []).includes(tool.id)}
                        onCheckedChange={(v) => {
                          if (tool.id === "web") updateData("enableWebSearch", v)
                          else if (tool.id === "code") updateData("enableCodeInterpreter", v)
                          else {
                            const newTools = v
                              ? [...(node.data.tools || []), tool.id]
                              : (node.data.tools || []).filter((t: string) => t !== tool.id)
                            updateData("tools", newTools)
                          }
                        }}
                        className="scale-75 origin-right data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Custom API Extension</Label>
              <div className="p-4 rounded-2xl bg-white/[0.02] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.04] transition-all cursor-pointer">
                <Wrench className="w-5 h-5 text-white/20" />
                <p className="text-[10px] text-white/40 font-medium">Define Custom Tool Definition</p>
                <Button variant="outline" size="sm" className="h-8 text-[9px] rounded-lg bg-white/5 border-white/10 hover:bg-white/10">Configure Webhook</Button>
              </div>
            </div>
          </div>
        )

      case "guardrails":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Compliance Engine</Label>
              <div className="space-y-2">
                <Label className="text-[11px] text-white/60">Policy Framework</Label>
                <Select value={node.data.contentPolicy || "standard"} onValueChange={(v) => updateData("contentPolicy", v)}>
                  <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a25]/95 border-white/10 rounded-xl">
                    <SelectItem value="relaxed">Relaxed (Research Mode)</SelectItem>
                    <SelectItem value="standard">Standard (Default)</SelectItem>
                    <SelectItem value="strict">Strict (High Privacy / Enterprise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Safety Modules</Label>
              <div className="space-y-2">
                {[
                  { label: "Automatic PII Redaction", desc: "Mask emails, phones, SSNs" },
                  { label: "Abuse & Toxicity Filter", desc: "Block hate speech & harassment" },
                  { label: "Hallucination Cross-Check", desc: "Validate outputs against history" },
                  { label: "Competitor Shield", desc: "Block mention of listed parties" }
                ].map((mod) => (
                  <div key={mod.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-all group">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">{mod.label}</span>
                      <p className="text-[9px] text-white/30">{mod.desc}</p>
                    </div>
                    <Switch className="scale-75 origin-right data-[state=checked]:bg-red-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "audio":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Vocal Synthesis</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Voice Engine</Label>
                  <Select value={node.data.engine || "elevenlabs"} onValueChange={(v) => updateData("engine", v)}>
                    <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevenlabs">ElevenLabs v2 (Neural)</SelectItem>
                      <SelectItem value="openai-tts">OpenAI Onyx</SelectItem>
                      <SelectItem value="playht">Play.ht Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] text-white/60">Stability</Label>
                    <span className="text-[10px] font-mono text-white/40">{node.data.stability || 0.5}</span>
                  </div>
                  <Slider
                    value={[node.data.stability || 0.5]}
                    onValueChange={([v]) => updateData("stability", v)}
                    max={1} step={0.05}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "httpRequest":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">External Integration</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Select value={node.data.method || "GET"} onValueChange={(v) => updateData("method", v)}>
                    <SelectTrigger className="w-24 h-10 border-white/5 bg-white/[0.03] rounded-xl text-[10px] font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="https://api.example.com/v1/..."
                    value={node.data.url || ""}
                    onChange={(e) => updateData("url", e.target.value)}
                    className="h-10 border-white/5 bg-white/[0.03] rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-2 pt-2">
                  <Label className="text-[11px] text-white/40 uppercase font-bold">Headers (JSON)</Label>
                  <Textarea
                    placeholder='{ "Authorization": "Bearer $API_KEY" }'
                    className="min-h-[100px] font-mono text-[10px] bg-black/40 border-white/5 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "tool":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Functional Extension</Label>
              <div className="space-y-4">
                <Input
                  placeholder="Tool Name (snake_case)"
                  value={node.data.id || ""}
                  onChange={(e) => updateData("id", e.target.value)}
                  className="h-11 border-white/5 bg-white/[0.03] rounded-xl"
                />
                <Textarea
                  placeholder="Describe what this tool does for the LLM..."
                  value={node.data.description || ""}
                  onChange={(e) => updateData("description", e.target.value)}
                  className="min-h-[100px] text-xs bg-white/[0.03] border-white/5 rounded-xl"
                />
                <div className="p-4 rounded-2xl bg-white/[0.01] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-2">
                  <p className="text-[10px] text-white/40">Define Parameters Schema</p>
                  <Button variant="outline" size="sm" className="h-8 text-[9px] rounded-lg">Open JSON Editor</Button>
                </div>
              </div>
            </div>
          </div>
        )

      case "structuredOutput":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Deductive Reasoning</Label>
              <div className="space-y-2">
                <Label className="text-[11px] text-white/60">Logic Framework</Label>
                <Select value={node.data.framework || "zod"} onValueChange={(v) => updateData("framework", v)}>
                  <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl font-mono text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zod">Zod (TypeScript Native)</SelectItem>
                    <SelectItem value="json">Raw JSON Schema</SelectItem>
                    <SelectItem value="pydantic">Pydantic Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[11px] text-white/60">Schema Definition</Label>
                <Textarea
                  placeholder="import { z } from 'zod';\n\nconst Schema = z.object({ ... });"
                  className="min-h-[200px] font-mono text-[11px] bg-black/40 border-white/5 rounded-2xl p-4"
                />
              </div>
            </div>
          </div>
        )

      case "embeddingModel":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Vector Intelligence</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Vector Engine</Label>
                  <Select value={node.data.model || "text-embedding-3-small"} onValueChange={(v) => updateData("model", v)}>
                    <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-embedding-3-small">OpenAI V3 Small</SelectItem>
                      <SelectItem value="text-embedding-3-large">OpenAI V3 Large</SelectItem>
                      <SelectItem value="voyage-2">Voyage AI (Law/Finance)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold">Dimensions</Label>
                    <p className="text-[9px] text-white/30">Auto-calculated vector size</p>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">1536d</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "imageGeneration":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Studio Parameters</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Synthesizer</Label>
                  <Select value={node.data.engine || "dalle-3"} onValueChange={(v) => updateData("engine", v)}>
                    <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dalle-3">DALL·E 3 (High Detail)</SelectItem>
                      <SelectItem value="stable-diffusion-xl">SDXL (Creative)</SelectItem>
                      <SelectItem value="flux-1-pro">Flux.1 Pro (Cinematic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <Label className="text-[10px] text-white/40 uppercase font-bold">Aspect Ratio</Label>
                    <Select value={node.data.aspectRatio || "1:1"} onValueChange={(v) => updateData("aspectRatio", v)}>
                      <SelectTrigger className="h-8 bg-black/20 border-transparent text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">1:1 Square</SelectItem>
                        <SelectItem value="16:9">16:9 Cinema</SelectItem>
                        <SelectItem value="9:16">9:16 Story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] text-white/40 uppercase font-bold">Quality</Label>
                      <span className="text-[9px] font-mono text-amber-400">HD</span>
                    </div>
                    <Switch
                      checked={node.data.hd}
                      onCheckedChange={(v) => updateData("hd", v)}
                      className="scale-75 origin-left data-[state=checked]:bg-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "javascript":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Sandboxed Runtime</Label>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-[8px] font-mono text-yellow-500/50">V8 ENGINE</span>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-yellow-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Textarea
                  value={node.data.code || "function transform(input) {\n  return input.toUpperCase();\n}"}
                  onChange={(e) => updateData("code", e.target.value)}
                  className="min-h-[300px] font-mono text-[11px] bg-black/60 border-white/5 rounded-2xl custom-scrollbar leading-relaxed text-yellow-100/80"
                />
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-[9px] font-bold text-white/40 uppercase">Global Context</span>
                </div>
                <p className="text-[9px] text-white/20 leading-relaxed">
                  Access workflow variables via the <code className="text-yellow-500/50">env</code> object. Use <code className="text-yellow-500/50">return</code> to pass data to the next node.
                </p>
              </div>
            </div>
          </div>
        )

      case "conditional":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Logic Conditionals</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white/80">IF STATEMENT</span>
                </div>

                <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="space-y-2">
                    <Label className="text-[11px] text-white/60">Evaluate Variable</Label>
                    <Input
                      placeholder="$last_response"
                      value={node.data.variable || ""}
                      onChange={(e) => updateData("variable", e.target.value)}
                      className="h-9 bg-black/20 border-white/5 text-xs text-purple-300 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] text-white/60">Operator</Label>
                    <Select value={node.data.operator || "contains"} onValueChange={(v) => updateData("operator", v)}>
                      <SelectTrigger className="h-9 border-white/5 bg-black/20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a25]/95">
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="equals">Exactly Equals</SelectItem>
                        <SelectItem value="regex">Matches Regex</SelectItem>
                        <SelectItem value="gt">Greater Than</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] text-white/60">Target Value</Label>
                    <Input
                      placeholder="e.g. 'error' or 'positive'"
                      value={node.data.value || ""}
                      onChange={(e) => updateData("value", e.target.value)}
                      className="h-9 bg-black/20 border-white/5 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-white/80 uppercase">True Path</p>
                    <p className="text-[9px] text-white/30 italic">Proceed to next connected node</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "mcpServer":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Protocol Configuration</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Server Endpoint</Label>
                  <Input
                    placeholder="https://mcp.0rca.live/api/my-tools"
                    value={node.data.url || ""}
                    onChange={(e) => updateData("url", e.target.value)}
                    className="h-11 border-white/5 bg-white/[0.03] rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[11px] text-white/60">Transport</Label>
                    <Select value={node.data.transport || "http"} onValueChange={(v) => updateData("transport", v)}>
                      <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a25]/95">
                        <SelectItem value="http">Streamable (HTTP)</SelectItem>
                        <SelectItem value="sse">SSE Handshake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] text-white/60">Auth Method</Label>
                    <Select value={node.data.authMethod || "None"} onValueChange={(v) => updateData("authMethod", v)}>
                      <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a25]/95">
                        <SelectItem value="None">No Auth</SelectItem>
                        <SelectItem value="API Key">API Key</SelectItem>
                        <SelectItem value="OAuth2">OAuth2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {node.data.authMethod === "API Key" && (
                  <MotionDiv
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-white/40 uppercase">Key Name</Label>
                        <Input
                          placeholder="e.g. X-API-Key"
                          value={node.data.keyName || ""}
                          onChange={(e) => updateData("keyName", e.target.value)}
                          className="h-9 bg-black/20 border-white/5 text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-white/40 uppercase">Location</Label>
                        <Select value={node.data.location || "Header"} onValueChange={(v) => updateData("location", v)}>
                          <SelectTrigger className="h-9 bg-black/20 border-white/5 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a25]/95">
                            <SelectItem value="Header">Header</SelectItem>
                            <SelectItem value="Query">Query</SelectItem>
                            <SelectItem value="Cookie">Cookie</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-white/40 uppercase">Key Value</Label>
                      <Input
                        type="password"
                        placeholder="sk-..."
                        value={node.data.keyValue || ""}
                        onChange={(e) => updateData("keyValue", e.target.value)}
                        className="h-9 bg-black/20 border-white/5 text-xs font-mono"
                      />
                    </div>
                  </MotionDiv>
                )}

                {syncError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-[10px] text-red-400">
                    <Info className="w-3 h-3" />
                    {syncError}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-white/40 uppercase font-bold tracking-tight">Capabilities Manifest</Label>
                    <span className="text-[10px] font-mono text-blue-400">{(node.data.tools || []).length} units synced</span>
                  </div>

                  <Button
                    onClick={handleSyncMcp}
                    disabled={isSyncing}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold gap-2 shadow-lg shadow-blue-900/40 border-0 disabled:opacity-50"
                  >
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    {isSyncing ? "Connecting Protocol..." : "Sync Protocol Gateway"}
                  </Button>
                  {(node.data.tools || []).length > 0 ? (
                    <div className="space-y-2">
                      {(node.data.tools || []).slice(0, 3).map((tool: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-white/60">
                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                          <span className="font-bold">{tool.name}</span>
                        </div>
                      ))}
                      {(node.data.tools || []).length > 3 && (
                        <div className="text-[9px] text-white/30 italic">+ {(node.data.tools || []).length - 3} more tools...</div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-white/20 italic text-center py-2">No tools synced. Enter URL and refresh on node.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case "cron":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Temporal Logic</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Execution Schedule (Cron Expression)</Label>
                  <Input
                    placeholder="0 * * * *"
                    value={node.data.schedule || "0 * * * *"}
                    onChange={(e) => updateData("schedule", e.target.value)}
                    className="h-11 border-white/5 bg-white/[0.03] rounded-xl font-mono text-amber-500"
                  />
                  <p className="text-[10px] text-white/20 italic">Format: minute hour day month weekday</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Timezone</Label>
                  <Select value={node.data.timezone || "UTC"} onValueChange={(v) => updateData("timezone", v)}>
                    <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a25]/95">
                      <SelectItem value="UTC">UTC (Universal)</SelectItem>
                      <SelectItem value="EST">EST (Eastern Standard)</SelectItem>
                      <SelectItem value="PST">PST (Pacific Standard)</SelectItem>
                      <SelectItem value="GMT">GMT (Greenwich)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-white/60 uppercase">Daemon Status</span>
                  </div>
                  <p className="text-[10px] text-white/30">This workflow will trigger automatically based on the provider's execution engine.</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "telegram":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Telegram API Configuration</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Bot Token</Label>
                  <Input
                    type="password"
                    placeholder="123456789:ABCdef..."
                    value={node.data.botToken || ""}
                    onChange={(e) => updateData("botToken", e.target.value)}
                    className="h-11 border-white/5 bg-white/[0.03] rounded-xl font-mono text-sky-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Chat ID / Channel ID</Label>
                  <Input
                    placeholder="-100123456789"
                    value={node.data.chatId || ""}
                    onChange={(e) => updateData("chatId", e.target.value)}
                    className="h-11 border-white/5 bg-white/[0.03] rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "intelligenceModel":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Model Architecture</Label>
              <div className="space-y-6">
                <div className="space-y-2 hover:bg-white/[0.02] p-2 rounded-xl transition-colors">
                  <Label className="text-[11px] text-white/60">Provider</Label>
                  <Select value={node.data.provider || "openai"} onValueChange={(v) => updateData("provider", v)}>
                    <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a25]/95 border-white/10">
                      <SelectItem value="openai">OpenAI (Primary)</SelectItem>
                      <SelectItem value="google">Google Gemini</SelectItem>
                      <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 hover:bg-white/[0.02] p-2 rounded-xl transition-colors">
                  <Label className="text-[11px] text-white/60">Model Selection</Label>
                  <Select value={node.data.model || "gpt-4o"} onValueChange={(v) => updateData("model", v)}>
                    <SelectTrigger className="h-11 border-white/5 bg-white/[0.03] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a25]/95 border-white/10">
                      {node.data.provider === "google" ? (
                        <>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                          <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="gpt-4o">GPT-4o (Omni)</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="o1-preview">OpenAI o1 Preview</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 px-4 py-4 rounded-2xl bg-violet-500/5 border border-violet-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-3 h-3 text-violet-400" />
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-violet-400/80">Sensitive Access</Label>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter Provider API Key..."
                    value={node.data.apiKey || ""}
                    onChange={(e) => updateData("apiKey", e.target.value)}
                    className="h-11 border-white/5 bg-white/[0.03] rounded-xl font-mono text-xs focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "discord":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Discord API Configuration</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/60">Webhook URL</Label>
                  <Input
                    type="password"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={node.data.webhookUrl || ""}
                    onChange={(e) => updateData("webhookUrl", e.target.value)}
                    className="h-11 border-white/5 bg-white/[0.03] rounded-xl font-mono text-indigo-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 select-none">
            <div className="relative mb-6">
              <div className="absolute inset-0 blur-2xl bg-white/10 rounded-full" />
              <Settings2 className="w-12 h-12 text-white relative" />
            </div>
            <p className="text-xs tracking-widest uppercase font-bold text-white/50">Terminal Node</p>
            <p className="text-[10px] text-white/30 mt-2 max-w-[180px]">No configurable parameters found for this specific functional interface.</p>
          </div>
        )
    }
  }


  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-16 bottom-0 z-[100] w-[340px] flex flex-col border-l border-white/[0.06] bg-[#09090b]/90 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: info.theme }} />
        <div className="absolute top-1/2 -right-32 w-48 h-96 rounded-full opacity-[0.03] blur-3xl bg-white" />

        {/* Header Section */}
        <div className="relative flex flex-col gap-5 p-8 pb-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${info.color} shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden group`}>
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                <info.icon className="h-6 w-6 text-white relative z-10" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight uppercase tracking-[0.05em]">{info.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: info.theme }} />
                  <p className="text-[10px] font-mono text-white/40 tracking-wider">0x{node.id.padStart(4, '0')}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/20 transition-all hover:bg-white/5 hover:text-white border border-white/0 hover:border-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/[0.08] rounded-full" />
            <p className="text-xs text-white/40 leading-relaxed font-medium pl-4 py-1 italic">
              {info.description}
            </p>
          </div>
        </div>

        {/* Scrollable Configuration Body */}
        <div className="relative flex-1 overflow-y-auto px-8 custom-scrollbar no-scrollbar-firefox">
          <div className="pb-20 pt-4 space-y-6">
            {renderFields()}

            <div className="pt-6 border-t border-white/[0.05]">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Node Actions</span>
                  <Settings2 className="w-3 h-3 text-white/10 group-hover:text-white/40 transition-colors" />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => onDeleteNode && onDeleteNode(node.id)}
                  className="w-full justify-start gap-3 h-10 px-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Decommission Node
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="relative p-8 pt-6 border-t border-white/[0.05] bg-black/40 backdrop-blur-md">
          <Button
            variant="destructive"
            className="w-full bg-red-500/5 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-500 gap-3 h-12 rounded-2xl group overflow-hidden"
            onClick={() => onDeleteNode?.(node.id)}
          >
            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Trash2 className="w-4 h-4 relative z-10" />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] relative z-10">Purge Component</span>
          </Button>

          <p className="mt-4 text-[9px] text-center text-white/10 uppercase tracking-widest font-bold">
            0RCA-FLOW CORE / v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.4"}
          </p>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.15);
          }
          .no-scrollbar-firefox {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
          }
        `}</style>
      </MotionDiv>
    </AnimatePresence>
  )
}
