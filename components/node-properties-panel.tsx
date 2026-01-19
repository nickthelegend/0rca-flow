"use client"
import { X, ChevronRight, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

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

const nodeInfo: Record<string, { name: string; description: string; icon: string; color: string }> = {
  textModel: {
    name: "Text Model",
    description: "Generate text with AI language models like GPT-4, Claude, or Llama.",
    icon: "🧠",
    color: "from-violet-500 to-purple-500",
  },
  embeddingModel: {
    name: "Embedding Model",
    description: "Convert text into vector embeddings for semantic search and similarity.",
    icon: "⚡",
    color: "from-cyan-500 to-blue-500",
  },
  prompt: {
    name: "Prompt Template",
    description: "Create reusable prompt templates with variable substitution.",
    icon: "💬",
    color: "from-pink-500 to-rose-500",
  },
  imageGeneration: {
    name: "Image Generation",
    description: "Generate images using AI models like DALL-E or Stable Diffusion.",
    icon: "🎨",
    color: "from-amber-500 to-orange-500",
  },
  audio: {
    name: "Audio Generation",
    description: "Convert text to speech using AI voice synthesis.",
    icon: "🔊",
    color: "from-red-500 to-orange-500",
  },
  javascript: {
    name: "JavaScript",
    description: "Execute custom JavaScript code to transform data.",
    icon: "📝",
    color: "from-yellow-500 to-amber-500",
  },
  tool: {
    name: "Custom Tool",
    description: "Create tools that AI agents can use to perform actions.",
    icon: "🔧",
    color: "from-slate-500 to-zinc-500",
  },
  structuredOutput: {
    name: "Structured Output",
    description: "Parse AI responses into structured JSON schemas.",
    icon: "📋",
    color: "from-emerald-500 to-teal-500",
  },
  httpRequest: {
    name: "HTTP Request",
    description: "Make API calls to external services and webhooks.",
    icon: "🌐",
    color: "from-blue-500 to-cyan-500",
  },
  conditional: {
    name: "Conditional Logic",
    description: "Branch workflow based on conditions and expressions.",
    icon: "🔀",
    color: "from-purple-500 to-pink-500",
  },
  start: {
    name: "Start",
    description: "Entry point for the workflow execution.",
    icon: "▶️",
    color: "from-emerald-500 to-green-500",
  },
  end: {
    name: "End",
    description: "Final output point for the workflow.",
    icon: "🏁",
    color: "from-red-500 to-rose-500",
  },
  agentCore: {
    name: "Agent Core",
    description: "The primary logic and brain of your autonomous AI agent.",
    icon: "🤖",
    color: "from-emerald-500 to-teal-500",
  },
  systemPrompt: {
    name: "System Prompt",
    description: "Core instructions and personality for your AI agent.",
    icon: "📜",
    color: "from-blue-500 to-indigo-500",
  },
  toolsConfig: {
    name: "Tools Config",
    description: "Configure external tools and APIs the agent can access.",
    icon: "🛠️",
    color: "from-orange-500 to-amber-500",
  },
  memory: {
    name: "Memory",
    description: "Manage short-term and long-term conversation context.",
    icon: "🧠",
    color: "from-purple-500 to-pink-500",
  },
  knowledgeBase: {
    name: "Knowledge Base",
    description: "Connect agent to documents and vector databases (RAG).",
    icon: "📚",
    color: "from-cyan-500 to-blue-500",
  },
  guardrails: {
    name: "Guardrails",
    description: "Input/output safety and content filtering policies.",
    icon: "🛡️",
    color: "from-red-500 to-rose-500",
  },
  outputParser: {
    name: "Output Parser",
    description: "Format and validate agent responses for downstream use.",
    icon: "📤",
    color: "from-yellow-500 to-orange-500",
  },
}

export function NodePropertiesPanel({ node, onClose, onUpdateNodeData, onDeleteNode }: NodePropertiesPanelProps) {
  if (!node) return null

  const info = nodeInfo[node.type] || {
    name: node.type,
    description: "",
    icon: "📦",
    color: "from-gray-500 to-gray-600",
  }

  const updateData = (key: string, value: any) => {
    onUpdateNodeData(node.id, { ...node.data, [key]: value })
  }

  const renderFields = () => {
    switch (node.type) {
      case "textModel":
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Model</Label>
              <Select value={node.data.model || "openai/gpt-5"} onValueChange={(v) => updateData("model", v)}>
                <SelectTrigger className="h-9 border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai/gpt-5">OpenAI GPT-5</SelectItem>
                  <SelectItem value="openai/gpt-5-mini">OpenAI GPT-5 Mini</SelectItem>
                  <SelectItem value="anthropic/claude-sonnet-4">Claude Sonnet 4</SelectItem>
                  <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Temperature</Label>
                <span className="text-xs font-mono text-foreground">{node.data.temperature || 0.7}</span>
              </div>
              <Slider
                value={[node.data.temperature || 0.7]}
                onValueChange={([v]) => updateData("temperature", v)}
                min={0}
                max={2}
                step={0.1}
                className="py-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Max Tokens</Label>
                <span className="text-xs font-mono text-foreground">{node.data.maxTokens || 2000}</span>
              </div>
              <Slider
                value={[node.data.maxTokens || 2000]}
                onValueChange={([v]) => updateData("maxTokens", v)}
                min={100}
                max={8000}
                step={100}
                className="py-2"
              />
            </div>
          </>
        )

      case "prompt":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Content</Label>
              <span className="text-xs text-muted-foreground">{(node.data.content || "").length}/3000 characters</span>
            </div>
            <Textarea
              value={node.data.content || ""}
              onChange={(e) => updateData("content", e.target.value)}
              placeholder="Enter your prompt..."
              className="min-h-[120px] resize-none border-white/10 bg-white/5 text-sm"
            />
            <p className="text-xs text-amber-400">Use $input1, $input2 for variable substitution</p>
          </div>
        )

      case "httpRequest":
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">URL</Label>
              <Input
                value={node.data.url || ""}
                onChange={(e) => updateData("url", e.target.value)}
                placeholder="https://api.example.com"
                className="h-9 border-white/10 bg-white/5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Method</Label>
              <Select value={node.data.method || "GET"} onValueChange={(v) => updateData("method", v)}>
                <SelectTrigger className="h-9 border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case "conditional":
        return (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Condition</Label>
            <Input
              value={node.data.condition || ""}
              onChange={(e) => updateData("condition", e.target.value)}
              placeholder="input1 === 'value'"
              className="h-9 border-white/10 bg-white/5 font-mono text-sm"
            />
            <p className="text-xs text-amber-400">JavaScript expression that evaluates to true/false</p>
          </div>
        )

      case "imageGeneration":
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Model</Label>
              <Select value={node.data.model || "gemini-2.5-flash-image"} onValueChange={(v) => updateData("model", v)}>
                <SelectTrigger className="h-9 border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5-flash-image">Gemini Flash Image</SelectItem>
                  <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                  <SelectItem value="stable-diffusion-xl">Stable Diffusion XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Aspect Ratio</Label>
              <Select value={node.data.aspectRatio || "1:1"} onValueChange={(v) => updateData("aspectRatio", v)}>
                <SelectTrigger className="h-9 border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 Square</SelectItem>
                  <SelectItem value="16:9">16:9 Landscape</SelectItem>
                  <SelectItem value="9:16">9:16 Portrait</SelectItem>
                  <SelectItem value="4:3">4:3 Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case "javascript":
        return (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Code</Label>
            <Textarea
              value={node.data.code || ""}
              onChange={(e) => updateData("code", e.target.value)}
              placeholder="// Your JavaScript code here"
              className="min-h-[150px] resize-none border-white/10 bg-white/5 font-mono text-sm"
            />
            <p className="text-xs text-amber-400">Access inputs as input1, input2, etc.</p>
          </div>
        )

      case "agentCore":
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Agent Name</Label>
              <Input
                value={node.data.name || ""}
                onChange={(e) => updateData("name", e.target.value)}
                placeholder="My AI Agent"
                className="h-9 border-white/10 bg-white/5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Model</Label>
              <Select value={node.data.model || "openai/gpt-5"} onValueChange={(v) => updateData("model", v)}>
                <SelectTrigger className="h-9 border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai/gpt-5">OpenAI GPT-5</SelectItem>
                  <SelectItem value="anthropic/claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="google/gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea
                value={node.data.description || ""}
                onChange={(e) => updateData("description", e.target.value)}
                placeholder="What this agent does..."
                className="min-h-[80px] resize-none border-white/10 bg-white/5 text-sm"
              />
            </div>
          </>
        )

      case "systemPrompt":
        return (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">System Instructions</Label>
            <Textarea
              value={node.data.content || ""}
              onChange={(e) => updateData("content", e.target.value)}
              placeholder="You are a helpful AI assistant..."
              className="min-h-[150px] resize-none border-white/10 bg-white/5 text-sm"
            />
          </div>
        )

      case "toolsConfig":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm">Code Interpreter</span>
              <input
                type="checkbox"
                checked={node.data.enableCodeInterpreter}
                onChange={(e) => updateData("enableCodeInterpreter", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm">Web Search</span>
              <input
                type="checkbox"
                checked={node.data.enableWebSearch}
                onChange={(e) => updateData("enableWebSearch", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
              />
            </div>
          </div>
        )

      default:
        return <p className="text-sm text-muted-foreground">No configurable properties for this node type.</p>
    }
  }

  return (
    <div className="absolute left-4 top-4 z-40 w-72 animate-in slide-in-from-left-2 duration-200">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-card/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${info.color}`}>
              <span className="text-base">{info.icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{info.name}</h3>
              <p className="text-[10px] text-muted-foreground">{info.description.slice(0, 30)}...</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Learn More */}
        <button className="flex w-full items-center justify-between border-b border-white/5 px-4 py-2.5 text-left transition-colors hover:bg-white/5">
          <span className="text-xs text-muted-foreground">Learn more about "{info.name}"</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {/* Properties */}
        <div className="space-y-4 p-4">{renderFields()}</div>

        {/* Validation Warning */}
        {node.type === "prompt" && (!node.data.content || node.data.content.length < 1) && (
          <div className="border-t border-white/5 px-4 py-3">
            <p className="text-xs text-amber-400">Minimum 1 character required before you can run this tile.</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-white/5 p-4">
          <Button
            variant="destructive"
            className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all gap-2"
            onClick={() => onDeleteNode?.(node.id)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Component
          </Button>
        </div>
      </div>
    </div>
  )
}
