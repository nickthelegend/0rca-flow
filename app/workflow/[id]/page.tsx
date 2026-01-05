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
import { Cloud, Share2, Pencil, Bot } from "lucide-react"
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
import { AgentNode } from "@/components/nodes/agent-node"
import { AddNodePopover } from "@/components/add-node-popover"
import { AddAgentPopover } from "@/components/add-agent-popover"
import { AIChatbot } from "@/components/ai-chatbot"



import { LogoDropdown } from "@/components/logo-dropdown"
import { ShareDropdown } from "@/components/share-dropdown"
import { LeftToolbar } from "@/components/left-toolbar"
import { BottomToolbar } from "@/components/bottom-toolbar"
import { NodePropertiesPanel } from "@/components/node-properties-panel"
import { CodeExportDialog } from "@/components/code-export-dialog"
import { ExecutionPanel } from "@/components/execution-panel"
import { useParams, useRouter } from "next/navigation"
import { usePrivyWallet } from "@/hooks/use-privy-wallet"

const nodeTypes: NodeTypes = {
  textModel: TextModelNode,
  embeddingModel: EmbeddingModelNode,
  tool: ToolNode,
  structuredOutput: StructuredOutputNode,
  prompt: PromptNode,
  imageGeneration: ImageGenerationNode,
  audio: AudioNode,
  javascript: JavaScriptNode,
  start: StartNode,
  end: EndNode,
  conditional: ConditionalNode,
  httpRequest: HttpRequestNode,
  agent: AgentNode,
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

const getDefaultNodeData = (type: string) => {
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
    case "agent":
      return { name: "AI Agent", description: "An autonomous AI agent", model: "openai/gpt-5" }
    default:
      return {}
  }
}

function WorkflowBuilderInner() {
  const params = useParams()
  const router = useRouter()
  const { disconnect } = usePrivyWallet()
  const workflowId = params.id as string

  const loadWorkflow = useCallback(() => {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(`workflow-${workflowId}`)
    if (stored) {
      const data = JSON.parse(stored)
      return data
    }
    return null
  }, [workflowId])

  const savedWorkflow = loadWorkflow()

  const [nodes, setNodes] = useState<Node[]>(savedWorkflow?.nodes || initialNodes)
  const [edges, setEdges] = useState<Edge[]>(savedWorkflow?.edges || initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [showCodeExport, setShowCodeExport] = useState(false)
  const [showExecution, setShowExecution] = useState(false)
  const [workflowName, setWorkflowName] = useState(savedWorkflow?.name || "Untitled Workflow")
  const [isEditingName, setIsEditingName] = useState(false)
  const [activeTool, setActiveTool] = useState<"select" | "pan">("select")
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [showAddNodePopover, setShowAddNodePopover] = useState(false)
  const [showAddAgentPopover, setShowAddAgentPopover] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const nodeIdCounter = useRef(0)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([
    { nodes: savedWorkflow?.nodes || initialNodes, edges: savedWorkflow?.edges || initialEdges },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  const { zoomIn, zoomOut, fitView } = useReactFlow()

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null

  useEffect(() => {
    if (typeof window === "undefined") return
    if (nodes.length > 0) {
      const workflowData = {
        id: workflowId,
        name: workflowName,
        nodes,
        edges,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(`workflow-${workflowId}`, JSON.stringify(workflowData))
    }
  }, [nodes, edges, workflowName, workflowId])

  useEffect(() => {
    const maxId = Math.max(...nodes.map((n) => Number.parseInt(n.id) || 0), 0)
    nodeIdCounter.current = maxId + 1
  }, [])

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

  const handleSave = useCallback(() => {
    // Already auto-saving, but can add toast notification
    console.log("[v0] Workflow saved")
  }, [])

  const handlePlay = useCallback(() => {
    setShowExecution(true)
  }, [])

  const onUpdateNodeData = (nodeId: string, newData: any) => {
    const newNodes = nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node))
    setNodes(newNodes)
    pushHistory(newNodes, edges)
  }

  const onDeleteNode = (nodeId: string) => {
    const newNodes = nodes.filter((node) => node.id !== nodeId)
    const newEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    setNodes(newNodes)
    setEdges(newEdges)
    pushHistory(newNodes, newEdges)
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
      setShowPropertiesPanel(false)
    }
  }

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

  const handlePaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenuPos({ x: event.clientX, y: event.clientY })
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
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Cloud className="w-4 h-4 mr-2" />
              Synced
            </Button>
            <ShareDropdown
              onPublish={(visibility) => {
                console.log(`Publishing as ${visibility}`)
                // Add your publish logic here
              }}
            />
            <AIChatbot />
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
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
          node={selectedNode}
          onUpdateNodeData={onUpdateNodeData}
          onClose={() => {
            setShowPropertiesPanel(false)
            setSelectedNodeId(null)
          }}
        />
      )}

      {/* Main Canvas */}
      <div ref={reactFlowWrapper} className="h-full w-full pt-16">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
      {showCodeExport && <CodeExportDialog nodes={nodes} edges={edges} onClose={() => setShowCodeExport(false)} />}

      {/* Execution Panel */}
      {showExecution && <ExecutionPanel nodes={nodes} edges={edges} onClose={() => setShowExecution(false)} />}
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
