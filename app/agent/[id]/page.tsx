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
import { Cloud, Share2, Pencil, Play, MessageSquare } from "lucide-react"
import { LogoDropdown } from "@/components/logo-dropdown"
import { ShareDropdown } from "@/components/share-dropdown"
import { LeftToolbar } from "@/components/left-toolbar"
import { BottomToolbar } from "@/components/bottom-toolbar"
import { NodePropertiesPanel } from "@/components/node-properties-panel"
import { AIChatbot } from "@/components/ai-chatbot"
import { useParams, useRouter } from "next/navigation"
import { usePrivyWallet } from "@/hooks/use-privy-wallet"
import { supabase } from "@/lib/supabase"

// Agent-specific node components
import { AgentCoreNode } from "@/components/nodes/agent-core-node"
import { SystemPromptNode } from "@/components/nodes/system-prompt-node"
import { ToolsConfigNode } from "@/components/nodes/tools-config-node"
import { MemoryNode } from "@/components/nodes/memory-node"
import { KnowledgeBaseNode } from "@/components/nodes/knowledge-base-node"
import { GuardrailsNode } from "@/components/nodes/guardrails-node"
import { OutputParserNode } from "@/components/nodes/output-parser-node"
import { AgentAddNodePopover } from "@/components/agent-add-node-popover"
import { AgentTestPanel } from "@/components/agent-test-panel"
import IntelligenceModelNode from "@/components/nodes/intelligence-model-node"
import TelegramNode from "@/components/nodes/telegram-node"
import DiscordNode from "@/components/nodes/discord-node"
import McpServerNode from "@/components/nodes/mcp-server-node"

const nodeTypes: NodeTypes = {
  agentCore: AgentCoreNode as any,
  systemPrompt: SystemPromptNode as any,
  toolsConfig: ToolsConfigNode as any,
  memory: MemoryNode as any,
  knowledgeBase: KnowledgeBaseNode as any,
  guardrails: GuardrailsNode as any,
  intelligenceModel: IntelligenceModelNode as any,
  telegram: TelegramNode as any,
  discord: DiscordNode as any,
  mcpServer: McpServerNode as any,
}

const defaultEdgeOptions = {
  type: "smoothstep",
  animated: true,
  style: {
    stroke: "#10b981",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#10b981",
    width: 20,
    height: 20,
  },
}

const getDefaultNodeData = (type: string): Record<string, any> => {
  switch (type) {
    case "agentCore":
      return { name: "AI Agent", model: "openai/gpt-5", description: "An intelligent AI agent" }
    case "systemPrompt":
      return { content: "You are a helpful AI assistant.", role: "system" }
    case "toolsConfig":
      return { tools: [], enableCodeInterpreter: false, enableWebSearch: false }
    case "memory":
      return { type: "conversation", maxMessages: 50, summarize: true }
    case "knowledgeBase":
      return { sources: [], embeddingModel: "openai/text-embedding-3-small", chunkSize: 500 }
    case "guardrails":
      return { inputFilters: [], outputFilters: [], contentPolicy: "standard" }
    case "outputParser":
      return { format: "text", schema: null, validation: true }
    case "intelligenceModel":
      return { model: "gpt-4o", provider: "openai" }
    case "telegram":
      return { botToken: "", chatId: "" }
    case "discord":
      return { webhookUrl: "" }
    case "mcpServer":
      return { url: "", tools: [], status: "idle" }
    default:
      return {}
  }
}

const initialNodesList: Node[] = [
  {
    id: "1",
    type: "agentCore",
    position: { x: 400, y: 200 },
    data: { name: "AI Agent", model: "openai/gpt-5", description: "An intelligent AI agent" },
  },
]

function AgentBuilderInner() {
  const params = useParams()
  const router = useRouter()
  const { disconnect, walletAddress } = usePrivyWallet()
  const agentId = params.id as string

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [agentName, setAgentName] = useState("Untitled Agent")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [activeTool, setActiveTool] = useState<"select" | "pan">("select")
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [showAddNodePopover, setShowAddNodePopover] = useState(false)
  const [showTestPanel, setShowTestPanel] = useState(false)
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([
    { nodes: initialNodesList, edges: [] },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  const nodeIdCounter = useRef(1)
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null)

  // Load Agent
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const { data, error } = await supabase
          .from("agent_workflows")
          .select("*")
          .eq("id", agentId)
          .single()

        if (error && error.code !== "PGRST116") {
          console.error("Error loading agent:", error)
          return
        }

        if (data) {
          setNodes(data.nodes || initialNodesList)
          setEdges(data.edges || [])
          setAgentName(data.name || "Untitled Agent")
        } else {
          setNodes(initialNodesList)
        }
      } catch (e) {
        console.error("Failed to fetch agent", e)
      }
    }
    fetchAgent()
  }, [agentId])

  const { zoomIn, zoomOut, fitView } = useReactFlow()

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    edgesRef.current = edges
  }, [edges])

  useEffect(() => {
    reactFlowInstanceRef.current = reactFlowInstance
  }, [reactFlowInstance])

  useEffect(() => {
    if (nodes.length > 0) {
      const maxId = Math.max(...nodes.map((n) => Number.parseInt(n.id) || 0), 0)
      nodeIdCounter.current = Math.max(nodeIdCounter.current, maxId + 1)
    }
  }, [nodes])

  // Save Agent
  const handleSave = useCallback(async () => {
    if (!agentId) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("agent_workflows")
        .upsert({
          id: agentId,
          name: agentName,
          nodes,
          edges,
          wallet_address: walletAddress,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setLastSaved(new Date())
      console.log("[0rca] Agent saved successfully")
    } catch (error) {
      console.error("Error saving agent:", error)
    } finally {
      setIsSaving(false)
    }
  }, [nodes, edges, agentName, agentId, walletAddress])

  // Auto-save disabled as requested
  /*
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (nodes.length > 0) {
        handleSave()
      }
    }, 5000)

    return () => clearTimeout(saveTimeout)
  }, [nodes, edges, agentName, handleSave])
  */

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

  const onAddNode = useCallback(
    (type: string, sourceNodeId?: string) => {
      const currentNodes = nodesRef.current
      const currentEdges = edgesRef.current
      const rfInstance = reactFlowInstanceRef.current

      let position = { x: 400, y: 300 }

      if (sourceNodeId) {
        const sourceNode = currentNodes.find((n) => n.id === sourceNodeId)
        if (sourceNode) {
          position = {
            x: sourceNode.position.x + 350,
            y: sourceNode.position.y,
          }
        }
      } else if (contextMenuPos && rfInstance) {
        // Safe conversion of screen coordinates to flow coordinates
        try {
          position = rfInstance.screenToFlowPosition({
            x: contextMenuPos.x,
            y: contextMenuPos.y,
          })
        } catch (e) {
          console.error("Failed to convert position:", e)
          position = { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 }
        }
      } else if (rfInstance) {
        const { x, y, zoom } = rfInstance.getViewport()
        position = {
          x: (-x + window.innerWidth / 2) / zoom,
          y: (-y + window.innerHeight / 2) / zoom,
        }
      }

      const newNodeId = `${nodeIdCounter.current++}`

      const newNode: Node = {
        id: newNodeId,
        type,
        position,
        data: getDefaultNodeData(type),
      }

      const newNodes = [...currentNodes, newNode]
      let newEdges = [...currentEdges]

      if (sourceNodeId) {
        const newEdge: Edge = {
          id: `e${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#10b981", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
        }
        newEdges.push(newEdge)
      }

      setNodes(newNodes)
      setEdges(newEdges)
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push({ nodes: newNodes, edges: newEdges })
        return newHistory
      })
      setHistoryIndex((prev) => prev + 1)
      setShowAddNodePopover(false)
      setContextMenuPos(null)
    },
    [contextMenuPos, historyIndex],
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
        } else {
          // If the currently selected node is being unselected
          if (selectedNodeId === selectionChange.id) {
            setSelectedNodeId(null)
            setShowPropertiesPanel(false)
          }
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
          const currentNodes = nodesRef.current.filter((n) => !deletedIds.has(n.id))
          newHistory.push({ nodes: currentNodes, edges: newEdges })
          return newHistory
        })
        setHistoryIndex((prev) => prev + 1)
        return newEdges
      })
    },
    [historyIndex],
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges)
      setEdges(newEdges)

      if (changes.some(c => c.type === 'remove')) {
        pushHistory(nodes, newEdges)
      }
    },
    [nodes, edges, pushHistory],
  )

  const onConnect: OnConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#10b981", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      }
      const newEdges = addEdge(newEdge, edges)
      setEdges(newEdges)
      pushHistory(nodes, newEdges)
    },
    [nodes, edges, pushHistory],
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
    setShowTestPanel(true)
  }, [])

  const onUpdateNodeData = (nodeId: string, newData: Record<string, unknown>) => {
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

  const onDuplicateNode = useCallback(
    (nodeId: string) => {
      const nodeToDuplicate = nodesRef.current.find((node) => node.id === nodeId)
      if (nodeToDuplicate) {
        const newNodeId = `${nodeIdCounter.current++}`
        const newNode: Node = {
          ...nodeToDuplicate,
          id: newNodeId,
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50,
          },
          selected: false,
        }
        const newNodes = [...nodesRef.current, newNode]
        const newEdges = edgesRef.current
        setNodes(newNodes)
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1)
          newHistory.push({ nodes: newNodes, edges: newEdges })
          return newHistory
        })
        setHistoryIndex((prev) => prev + 1)
      }
    },
    [historyIndex],
  )

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
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingName(false)
                }}
                className="bg-transparent text-white text-lg font-medium border-b border-emerald-500 outline-none px-2 py-1"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-white text-lg font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 group"
              >
                {agentName}
                <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
            <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Agent</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setShowTestPanel(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Test Agent
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Cloud className={`w-4 h-4 mr-2 ${isSaving ? "animate-pulse" : ""}`} />
              {isSaving ? "Saving..." : "Save Agent"}
            </Button>
            <ShareDropdown
              onPublish={(visibility) => {
                console.log(`Publishing agent as ${visibility}`)
                // Add your publish logic here
              }}
            />
            <AIChatbot />
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
              <Play className="w-4 h-4 mr-2" />
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
          isAgentBuilder={true}
        />
      )}

      {/* Properties Panel */}
      {showPropertiesPanel && selectedNode && (
        <NodePropertiesPanel
          key={selectedNode.id}
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
          connectionLineStyle={{ stroke: "#10b981", strokeWidth: 2 }}
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

      {/* Context Menu Add Node Popover */}
      {showAddNodePopover && contextMenuPos && (
        <AgentAddNodePopover
          isOpen={showAddNodePopover}
          onAddNode={onAddNode}
          onClose={() => {
            setShowAddNodePopover(false)
            setContextMenuPos(null)
          }}
          position={contextMenuPos}
        />
      )}

      {/* Test Panel */}
      {showTestPanel && <AgentTestPanel agentName={agentName} nodes={nodes} onClose={() => setShowTestPanel(false)} />}
    </div>
  )
}

export default function AgentBuilder() {
  return (
    <ReactFlowProvider>
      <AgentBuilderInner />
    </ReactFlowProvider>
  )
}
