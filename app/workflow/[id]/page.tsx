"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeTypes,
  type ReactFlowInstance,
  useReactFlow,
  ReactFlowProvider,
  ConnectionLineType,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { Cloud, Share2, Pencil, Bot, X } from "lucide-react"
import TextModelNode from "@/components/nodes/text-model-node"
import EmbeddingModelNode from "@/components/nodes/embedding-model-node"
import ToolNode from "@/components/nodes/tool-node"
import StructuredOutputNode from "@/components/nodes/structured-output-node"
import PromptNode from "@/components/nodes/prompt-node"
import ImageGenerationNode from "@/components/nodes/image-generation-node"
import AudioNode from "@/components/nodes/audio-node"
import JavaScriptNode from "@/components/nodes/javascript-node"
import StartNode from "@/components/nodes/start-node"
import EndNode from "@/components/nodes/end-node"
import ConditionalNode from "@/components/nodes/conditional-node"
import HttpRequestNode from "@/components/nodes/http-request-node"
import McpServerNode from "@/components/nodes/mcp-server-node"
import CronNode from "@/components/nodes/cron-node"
import { AgentNode } from "@/components/nodes/agent-node"
import { AddNodePopover } from "@/components/add-node-popover"
import { AddAgentPopover } from "@/components/add-agent-popover"
import { AIChatbot } from "@/components/ai-chatbot"
import { Pricing } from "@/components/blocks/pricing"



import { LogoDropdown } from "@/components/logo-dropdown"
import { ShareDropdown } from "@/components/share-dropdown"
import { LeftToolbar } from "@/components/left-toolbar"
import { BottomToolbar } from "@/components/bottom-toolbar"
import { NodePropertiesPanel } from "@/components/node-properties-panel"
import { CodeExportDialog } from "@/components/code-export-dialog"
import { ExecutionPanel } from "@/components/execution-panel"
import { useParams, useRouter } from "next/navigation"
import { usePrivyWallet } from "@/hooks/use-privy-wallet"
import { supabase } from "@/lib/supabase"
import JSZip from "jszip"
import { generateAISDKCode } from "@/lib/code-generator"
import { DeploymentConfigDialog, type DeploymentConfig } from "@/components/deployment-config-dialog"

const nodeTypes: NodeTypes = {
  textModel: TextModelNode as any,
  embeddingModel: EmbeddingModelNode as any,
  tool: ToolNode as any,
  structuredOutput: StructuredOutputNode as any,
  prompt: PromptNode as any,
  imageGeneration: ImageGenerationNode as any,
  audio: AudioNode as any,
  javascript: JavaScriptNode as any,
  start: StartNode as any,
  end: EndNode as any,
  conditional: ConditionalNode as any,
  httpRequest: HttpRequestNode as any,
  mcpServer: McpServerNode as any,
  cron: CronNode as any,
  agent: AgentNode as any,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "start",
    position: { x: 250, y: 250 },
    data: {},
  },
]

const initialEdges: Edge[] = []

const defaultEdgeOptions = {
  type: "smoothstep",
  animated: true,
  style: {
    stroke: "#8b5cf6",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#8b5cf6",
    width: 20,
    height: 20,
  },
}

const getDefaultNodeData = (type: string): Record<string, any> => {
  switch (type) {
    case "textModel":
      return { model: "openai/gpt-5", temperature: 0.7, maxTokens: 2000 }
    case "embeddingModel":
      return { model: "openai/text-embedding-3-small", dimensions: 1536 }
    case "tool":
      return { name: "customTool", description: "A custom tool" }
    case "structuredOutput":
      return { schemaName: "Schema", mode: "object" }
    case "prompt":
      return { content: "Enter your prompt..." }
    case "imageGeneration":
      return { model: "gemini-2.5-flash-image", aspectRatio: "1:1", outputFormat: "png" }
    case "audio":
      return { model: "openai/tts-1", voice: "alloy", speed: 1.0 }
    case "javascript":
      return { code: "// Access inputs as input1, input2, etc.\nreturn input1.toUpperCase()" }
    case "start":
      return {}
    case "end":
      return {}
    case "conditional":
      return { condition: "input1 === 'value'" }
    case "httpRequest":
      return { url: "https://api.example.com", method: "GET" }
    case "mcpServer":
      return { url: "", tools: [] }
    case "cron":
      return { schedule: "0 * * * *", timezone: "UTC" }
    case "agent":
      return { name: "AI Agent", description: "An autonomous AI agent", model: "openai/gpt-5" }
    default:
      return {}
  }
}

const demoPlans = [
  {
    name: "STARTER",
    price: "50",
    yearlyPrice: "40",
    period: "per month",
    features: [
      "Up to 10 projects",
      "Basic analytics",
      "48-hour support response time",
      "Limited API access",
      "Community support",
    ],
    description: "Perfect for individuals and small projects",
    buttonText: "Start Free Trial",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "99",
    yearlyPrice: "79",
    period: "per month",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "24-hour support response time",
      "Full API access",
      "Priority support",
      "Team collaboration",
      "Custom integrations",
    ],
    description: "Ideal for growing teams and businesses",
    buttonText: "Get Started",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "299",
    yearlyPrice: "239",
    period: "per month",
    features: [
      "Everything in Professional",
      "Custom solutions",
      "Dedicated account manager",
      "1-hour support response time",
      "SSO Authentication",
      "Advanced security",
      "Custom contracts",
      "SLA agreement",
    ],
    description: "For large organizations with specific needs",
    buttonText: "Contact Sales",
    href: "/contact",
    isPopular: false,
  },
]

function WorkflowBuilderInner() {
  const params = useParams()
  const router = useRouter()
  const { disconnect, walletAddress } = usePrivyWallet()
  const workflowId = params.id as string

  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [showCodeExport, setShowCodeExport] = useState(false)
  const [showExecution, setShowExecution] = useState(false)
  const [workflowName, setWorkflowName] = useState("Untitled Workflow")
  const [isEditingName, setIsEditingName] = useState(false)
  const [activeTool, setActiveTool] = useState<"select" | "pan">("select")
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [showAddNodePopover, setShowAddNodePopover] = useState(false)
  const [showAddAgentPopover, setShowAddAgentPopover] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const nodeIdCounter = useRef(0)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([
    { nodes: initialNodes, edges: initialEdges },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  const { zoomIn, zoomOut, fitView } = useReactFlow()

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showDeploymentConfig, setShowDeploymentConfig] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)

  // Load Workflow
  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const { data, error } = await supabase
          .from("workflows")
          .select("*")
          .eq("id", workflowId)
          .single()

        if (error && error.code !== "PGRST116") {
          console.error("Error loading workflow:", error)
          return
        }

        if (data) {
          setNodes(data.nodes || initialNodes)
          setEdges(data.edges || initialEdges)
          setWorkflowName(data.name || "Untitled Workflow")
        } else {
          // Create if not exists (upsert logic in save, but maybe just leave generic for now or create on first save?)
          // Ideally we should create it if it doesn't exist so we have a record.
        }
      } catch (e) {
        console.error("Failed to fetch workflow", e)
      }
    }
    fetchWorkflow()
  }, [workflowId])

  // Save Workflow
  const handleSave = useCallback(async () => {
    if (!workflowId) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("workflows")
        .upsert({
          id: workflowId,
          name: workflowName,
          nodes,
          edges,
          wallet_address: walletAddress,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setLastSaved(new Date())
      console.log("[0rca] Workflow saved successfully")
    } catch (error) {
      console.error("Error saving workflow:", error)
    } finally {
      setIsSaving(false)
    }
  }, [nodes, edges, workflowName, workflowId, walletAddress])

  // Auto-save Workflow Debounced
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (nodes.length > 0) {
        handleSave()
      }
    }, 5000) // 5 second debounce for background autosave

    return () => clearTimeout(saveTimeout)
  }, [nodes, edges, workflowName, handleSave])


  useEffect(() => {
    if (nodes.length > 0) {
      const maxId = Math.max(...nodes.map((n) => Number.parseInt(n.id) || 0), 0)
      nodeIdCounter.current = Math.max(nodeIdCounter.current, maxId + 1)
    }
  }, [nodes])

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [isEditingName])

  const pushHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push({ nodes: newNodes, edges: newEdges })
        return newHistory
      })
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex],
  )

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const newNodes = applyNodeChanges(changes, nodes)
      setNodes(newNodes)

      const selectionChange = changes.find((c) => c.type === "select")
      if (selectionChange && selectionChange.type === "select") {
        if (selectionChange.selected) {
          setSelectedNodeId(selectionChange.id)
          setShowPropertiesPanel(true)
        }
      }
    },
    [nodes],
  )

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      const deletedIds = new Set(deletedNodes.map((n) => n.id))
      setEdges((currentEdges) => {
        const newEdges = currentEdges.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target))
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1)
          const currentNodes = nodes.filter((n) => !deletedIds.has(n.id))
          newHistory.push({ nodes: currentNodes, edges: newEdges })
          return newHistory
        })
        setHistoryIndex((prev) => prev + 1)
        return newEdges
      })
    },
    [nodes, historyIndex],
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges)
      setEdges(newEdges)
    },
    [edges],
  )

  const onConnect: OnConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#8b5cf6", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
      }
      const newEdges = addEdge(newEdge, edges)
      setEdges(newEdges)
      pushHistory(nodes, newEdges)
    },
    [nodes, edges, pushHistory],
  )

  const onAddNode = useCallback(
    (type: string, sourceNodeId?: string) => {
      if (!reactFlowInstance) return

      let position
      if (sourceNodeId) {
        const sourceNode = nodes.find((n) => n.id === sourceNodeId)
        if (sourceNode) {
          position = {
            x: sourceNode.position.x + 350,
            y: sourceNode.position.y,
          }
        }
      } else if (contextMenuPos) {
        position = reactFlowInstance.screenToFlowPosition(contextMenuPos)
      } else {
        const { x, y, zoom } = reactFlowInstance.getViewport()
        position = {
          x: (-x + window.innerWidth / 2) / zoom,
          y: (-y + window.innerHeight / 2) / zoom,
        }
      }

      const newNodeId = `${nodeIdCounter.current++}`
      const newNode: Node = {
        id: newNodeId,
        type,
        position: position!,
        data: getDefaultNodeData(type),
      }

      const newNodes = [...nodes, newNode]
      let newEdges = edges

      if (sourceNodeId) {
        const newEdge = {
          id: `e${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#8b5cf6", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
        }
        newEdges = [...edges, newEdge]
      }

      setNodes(newNodes)
      setEdges(newEdges)
      pushHistory(newNodes, newEdges)
      setShowAddNodePopover(false)
      setContextMenuPos(null)
    },
    [reactFlowInstance, nodes, edges, contextMenuPos, pushHistory],
  )

  const onAddAgent = useCallback(
    (agent: any) => {
      if (!reactFlowInstance) return

      const { x, y, zoom } = reactFlowInstance.getViewport()
      const position = {
        x: (-x + window.innerWidth / 2) / zoom,
        y: (-y + window.innerHeight / 2) / zoom,
      }

      const newNode: Node = {
        id: `${nodeIdCounter.current++}`,
        type: "agent",
        position,
        data: {
          agentId: agent.id,
          name: agent.name,
          description: agent.description,
          avatar: agent.avatar,
          category: agent.category,
        },
      }

      const newNodes = [...nodes, newNode]
      setNodes(newNodes)
      pushHistory(newNodes, edges)
      setShowAddAgentPopover(false)
    },
    [reactFlowInstance, nodes, edges, pushHistory],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const previousState = history[newIndex]
      setNodes(previousState.nodes)
      setEdges(previousState.edges)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const nextState = history[newIndex]
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex])

  const handlePlay = useCallback(() => {
    setShowPricing(true)
  }, [])

  const handleDownloadZip = useCallback(async () => {
    try {
      const code = generateAISDKCode(nodes, edges)
      const zip = new JSZip()

      // Package.json
      zip.file("package.json", JSON.stringify({
        name: `agent-${workflowId}`,
        version: "1.0.0",
        type: "module",
        dependencies: {
          "ai": "^4.0.0",
          "@ai-sdk/openai": "^1.0.0",
          "@ai-sdk/google": "^1.0.0",
          "zod": "^3.22.4",
          "dotenv": "^16.4.5",
          "@hono/node-server": "^1.13.7",
          "hono": "^4.6.14",
          "tsx": "^4.19.2"
        },
        scripts: {
          "start": "tsx index.ts"
        }
      }, null, 2))

      // Workflow Code
      zip.file("workflow.ts", code)

      // Server Wrapper
      const serverCode = `import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { runAgentWorkflow } from './workflow';
import { config } from 'dotenv';
config();

const app = new Hono();

app.get('/', (c) => c.text('Agent Running'));

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const input = body.prompt || body.input || "";
    const result = await runAgentWorkflow(input);
    return c.json({ result });
  } catch (e) {
    console.error(e);
    return c.json({ error: String(e) }, 500);
  }
});

const port = process.env.PORT || 8080;
console.log(\`Server listening on port \${port}\`);
serve({
  fetch: app.fetch,
  port: Number(port)
});`

      zip.file("index.ts", serverCode)
      zip.file(".env.example", "OPENAI_API_KEY=\nGOOGLE_API_KEY=\n")

      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = `agent-${workflowId}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error("Export failed:", e)
    }
  }, [nodes, edges, workflowId])

  const handleDeploy = useCallback(() => {
    setShowDeploymentConfig(true)
  }, [])

  const onDeployAgent = async (config: DeploymentConfig) => {
    setIsDeploying(true)
    try {
      const code = generateAISDKCode(nodes, edges)
      const zip = new JSZip()

      // Package.json
      zip.file("package.json", JSON.stringify({
        name: `agent-${workflowId}`,
        version: "1.0.0",
        description: "0rca Agent",
        type: "module",
        dependencies: {
          "ai": "^4.0.0",
          "@ai-sdk/openai": "^1.0.0",
          "@ai-sdk/google": "^1.0.0",
          "zod": "^3.22.4",
          "dotenv": "^16.4.5",
          "@hono/node-server": "^1.13.7",
          "hono": "^4.6.14",
          "tsx": "^4.19.2"
        },
        scripts: {
          "start": "tsx index.ts"
        }
      }, null, 2))

      // Workflow Code
      zip.file("workflow.ts", code)

      // Server Wrapper
      const serverCode = `import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { runAgentWorkflow } from './workflow';
import { config } from 'dotenv';
config();

const app = new Hono();

app.get('/', (c) => c.text('Agent Running'));

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const input = body.prompt || body.input || "";
    const result = await runAgentWorkflow(input);
    return c.json({ result });
  } catch (e) {
    console.error(e);
    return c.json({ error: String(e) }, 500);
  }
});

const port = process.env.PORT || 8080;
console.log(\`Server listening on port \${port}\`);
serve({
  fetch: app.fetch,
  port: Number(port)
});`

      zip.file("index.ts", serverCode)

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const formData = new FormData()
      formData.append("file", zipBlob, "agent.zip")
      formData.append("envVars", JSON.stringify(config.envVars))

      const res = await fetch("/api/deploy", {
        method: "POST",
        body: formData
      })

      if (!res.ok) throw new Error("Deployment failed: " + await res.text())

      const data = await res.json()
      alert(`Deployment Started! URL: ${data.url}`)
      setShowDeploymentConfig(false)

    } catch (e: any) {
      console.error(e)
      alert("Error: " + e.message)
    } finally {
      setIsDeploying(false)
    }
  }

  const onUpdateNodeData = (nodeId: string, newData: any) => {
    const newNodes = nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node))
    setNodes(newNodes)
    pushHistory(newNodes, edges)
  }

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((currentNodes) => {
        const newNodes = currentNodes.filter((node) => node.id !== nodeId)
        setEdges((currentEdges) => {
          const newEdges = currentEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
          setHistory((prev) => {
            const newHistory = prev.slice(0, historyIndex + 1)
            newHistory.push({ nodes: newNodes, edges: newEdges })
            return newHistory
          })
          setHistoryIndex((prev) => prev + 1)
          return newEdges
        })
        return newNodes
      })

      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null)
        setShowPropertiesPanel(false)
      }
    },
    [selectedNodeId, historyIndex],
  )

  const onDuplicateNode = (nodeId: string) => {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId)
    if (nodeToDuplicate) {
      const newNode: Node = {
        ...nodeToDuplicate,
        id: `${nodeIdCounter.current++}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
      }
      const newNodes = [...nodes, newNode]
      setNodes(newNodes)
      pushHistory(newNodes, edges)
    }
  }

  const handlePaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault()
    if ("clientX" in event) {
      setContextMenuPos({ x: event.clientX, y: event.clientY })
    }
    setShowAddNodePopover(true)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
    setShowPropertiesPanel(false)
    setContextMenuPos(null)
    setShowAddNodePopover(false)
  }, [])

  const handleToolbarAddNode = useCallback(
    (type: string) => {
      onAddNode(type)
    },
    [onAddNode],
  )

  return (
    <div className="h-screen w-full bg-[#0a0a0f] relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 h-16 border-b border-white/5 backdrop-blur-xl bg-black/40">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <LogoDropdown
              onSignOut={async () => {
                await disconnect()
                router.push("/")
              }}
            />
            <div className="h-6 w-px bg-white/10" />
            {isEditingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingName(false)
                }}
                className="bg-transparent text-white text-lg font-medium border-b border-violet-500 outline-none px-2 py-1"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-white text-lg font-medium hover:text-violet-400 transition-colors flex items-center gap-2 group"
              >
                {workflowName}
                <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setShowAddAgentPopover(true)}
            >
              <Bot className="w-4 h-4 mr-2" />
              Add Agents
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Cloud className={`w-4 h-4 mr-2 ${isSaving ? "animate-pulse" : ""}`} />
              {isSaving ? "Saving..." : "Save Workflow"}
            </Button>
            <ShareDropdown
              onPublish={(visibility) => {
                console.log(`Publishing as ${visibility}`)
                // Add your publish logic here
              }}
            />
            <AIChatbot />
            <Button
              onClick={handleDeploy}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              Deploy
            </Button>
          </div>
        </div>
      </div>

      {/* Left Toolbar */}
      {!isLogoDropdownOpen && !showPropertiesPanel && (
        <LeftToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onAddNode={handleToolbarAddNode}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitView={() => fitView()}
          showPropertiesPanel={showPropertiesPanel}
        />
      )}

      {/* Properties Panel */}
      {showPropertiesPanel && selectedNode && (
        <NodePropertiesPanel
          node={selectedNode as any}
          onUpdateNodeData={onUpdateNodeData}
          onDeleteNode={onDeleteNode}
          onClose={() => {
            setShowPropertiesPanel(false)
            setSelectedNodeId(null)
          }}
        />
      )}

      {/* Main Canvas */}
      <div ref={reactFlowWrapper} className="h-full w-full pt-16">
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onDeleteNode,
              onAddNode,
              onDuplicateNode,
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{ stroke: "#8b5cf6", strokeWidth: 2 }}
          fitView
          panOnScroll={activeTool === "pan"}
          selectionOnDrag={activeTool === "select"}
          panOnDrag={activeTool === "pan"}
          onPaneContextMenu={handlePaneContextMenu}
          onPaneClick={onPaneClick}
          className="bg-[#0a0a0f]"
        >
          <Background color="#ffffff" gap={16} size={1} className="opacity-5" />
        </ReactFlow>
      </div>

      <BottomToolbar
        onSave={handleSave}
        onPlay={handlePlay}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isPanMode={activeTool === "pan"}
        onPanToggle={() => setActiveTool(activeTool === "pan" ? "select" : "pan")}
      />

      {/* Add Node Popover - only for right-click context menu */}
      <AddNodePopover
        isOpen={showAddNodePopover}
        onAddNode={onAddNode}
        onClose={() => {
          setShowAddNodePopover(false)
          setContextMenuPos(null)
        }}
        position={contextMenuPos}
      />

      {/* Add Agent Popover */}
      <AddAgentPopover
        isOpen={showAddAgentPopover}
        onAddAgent={onAddAgent}
        onClose={() => setShowAddAgentPopover(false)}
      />

      {/* Code Export Dialog */}
      <CodeExportDialog
        open={showCodeExport}
        onOpenChange={setShowCodeExport}
        nodes={nodes}
        edges={edges}
      />

      {/* Execution Panel */}
      {showExecution && <ExecutionPanel nodes={nodes} edges={edges} onClose={() => setShowExecution(false)} />}

      {/* Pricing Overlay */}
      {showPricing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full min-h-screen py-10">
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-6 right-6 z-[110] text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setShowPricing(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="container mx-auto px-4">
              <Pricing plans={demoPlans} />
            </div>

            {/* Bypass for demo functionality - hidden trigger to actually run/deploy if needed */}
            {/* For now, just a button at the bottom to continue for demo purposes */}
            <div className="flex justify-center mt-8 pb-10">
              <Button
                variant="link"
                className="text-white/30 hover:text-white/50"
                onClick={() => {
                  setShowPricing(false)
                  setShowExecution(true)
                }}
              >
                Skip to Execution (Demo)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  )
}
