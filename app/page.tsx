"use client"
import { useState, useEffect } from "react"
import { usePrivyWallet } from "@/hooks/use-privy-wallet"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Sparkles,
  Clock,
  WorkflowIcon,
  Zap,
  ArrowRight,
  Search,
  Bot,
  Users,
  Brain,
  FileText,
  Wallet,
  LogOut,
  ChevronDown,
  Copy,
  ExternalLink,
  Shield,
} from "lucide-react"
import { CreateWorkflowModal } from "@/components/create-workflow-modal"
import { CreateAgentModal } from "@/components/create-agent-modal"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

interface WorkflowType {
  id: string
  name: string
  description?: string
  category?: string
  createdAt: string
  updatedAt: string
  nodes: any[]
  edges: any[]
}

interface AgentType {
  id: string
  name: string
  description?: string
  category?: string
  model?: string
  createdAt: string
  updatedAt: string
}

export default function HomePage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<WorkflowType[]>([])
  const [agents, setAgents] = useState<AgentType[]>([])
  const [showCreateWorkflowModal, setShowCreateWorkflowModal] = useState(false)
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"workflows" | "agents">("workflows")
  const [showWalletDropdown, setShowWalletDropdown] = useState(false)

  const { connect, disconnect, isConnected: isWalletConnected, walletAddress } = usePrivyWallet();


  useEffect(() => {
    if (!isWalletConnected || !walletAddress) return

    const loadData = async () => {
      try {
        const { data: wfData, error: wfError } = await supabase
          .from("workflows")
          .select("*")
          .eq("wallet_address", walletAddress)
          .order("updated_at", { ascending: false })

        if (wfError) throw wfError

        const { data: agData, error: agError } = await supabase
          .from("agent_workflows")
          .select("*")
          .eq("wallet_address", walletAddress)
          .order("updated_at", { ascending: false })

        if (agError) throw agError

        setWorkflows(wfData || [])
        setAgents(agData || [])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
    }

    loadData()
  }, [isWalletConnected, walletAddress])

  const connectWallet = () => {
    connect();
  }

  const disconnectWallet = async () => {
    await disconnect();
    setShowWalletDropdown(false)
  }

  const filteredWorkflows = workflows.filter((w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredAgents = agents.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "Data Processing":
      case "Data":
        return <Zap className="w-6 h-6 text-white" />
      case "Content Generation":
      case "Content":
        return <FileText className="w-6 h-6 text-white" />
      case "API Integration":
        return <WorkflowIcon className="w-6 h-6 text-white" />
      case "Business Automation":
        return <Users className="w-6 h-6 text-white" />
      case "Research":
        return <Brain className="w-6 h-6 text-white" />
      case "Customer":
        return <Users className="w-6 h-6 text-white" />
      default:
        return <Bot className="w-6 h-6 text-white" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Data Processing":
      case "Data":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
      case "Content Generation":
      case "Content":
        return "from-violet-500/20 to-purple-500/20 border-violet-500/30"
      case "API Integration":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30"
      case "Business Automation":
        return "from-orange-500/20 to-amber-500/20 border-orange-500/30"
      case "Research":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
      case "Customer":
        return "from-orange-500/20 to-amber-500/20 border-orange-500/30"
      default:
        return "from-gray-500/20 to-slate-500/20 border-gray-500/30"
    }
  }

  const getCategoryIconBg = (category?: string) => {
    switch (category) {
      case "Data Processing":
      case "Data":
        return "from-blue-500 to-cyan-500"
      case "Content Generation":
      case "Content":
        return "from-violet-500 to-purple-500"
      case "API Integration":
        return "from-green-500 to-emerald-500"
      case "Business Automation":
        return "from-orange-500 to-amber-500"
      case "Research":
        return "from-blue-500 to-cyan-500"
      case "Customer":
        return "from-orange-500 to-amber-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-violet-500/25">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            {/* AI Studio text removed as per request */}
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button className="text-white/70 hover:text-white transition-colors text-sm font-medium">Dashboard</button>
            <button className="text-white/70 hover:text-white transition-colors text-sm font-medium">Templates</button>
            <button className="text-white/70 hover:text-white transition-colors text-sm font-medium">
              Marketplace
            </button>
            <button className="text-white/70 hover:text-white transition-colors text-sm font-medium">Docs</button>
          </nav>

          <div className="flex items-center gap-3">
            {isWalletConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-400">
                    {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-emerald-400" />
                </button>

                {showWalletDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Connected</div>
                          <div className="text-xs text-white/50">
                            {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all text-sm">
                        <Copy className="w-4 h-4" />
                        Copy Address
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all text-sm">
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                      </button>
                      <button
                        onClick={disconnectWallet}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      {!isWalletConnected ? (
        // Landing / Connect Wallet Screen
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
          <div className="relative">
            {/* Glow effects */}
            <div className="absolute -inset-40 bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-emerald-500/20 blur-3xl opacity-50" />

            <div className="relative text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-8 shadow-2xl shadow-violet-500/30">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                Build AI Agents & Workflows
              </h1>

              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                Create intelligent automation with our visual builder. Connect your wallet to access your workspace and
                start building.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button
                  onClick={connectWallet}
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl shadow-violet-500/30 px-8 py-6 text-lg"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 px-8 py-6 text-lg bg-transparent"
                >
                  Learn More
                </Button>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                    <WorkflowIcon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Visual Workflows</h3>
                  <p className="text-sm text-white/50">Drag and drop nodes to create complex automation flows</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Agents</h3>
                  <p className="text-sm text-white/50">Build autonomous agents with memory and tools</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
                  <p className="text-sm text-white/50">Your data stays yours with wallet-based authentication</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Connected - Show Dashboard
        <>
          {/* Premium Header with Gradient */}
          <div className="relative overflow-hidden border-b border-white/5 pt-16">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/10" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative max-w-7xl mx-auto px-6 py-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-2">
                    Welcome back
                  </h1>
                  <p className="text-white/50">Manage your AI agents and workflows</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowCreateAgentModal(true)}
                    size="lg"
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    Create Agent
                  </Button>
                  <Button
                    onClick={() => setShowCreateWorkflowModal(true)}
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Workflow
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                      <WorkflowIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{workflows.length}</div>
                      <div className="text-sm text-white/50">Workflows</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{agents.length}</div>
                      <div className="text-sm text-white/50">Agents</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{workflows.filter((w) => w.nodes?.length > 1).length}</div>
                      <div className="text-sm text-white/50">Active</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {workflows.length > 0 ? new Date(workflows[0].updatedAt).toLocaleDateString() : "N/A"}
                      </div>
                      <div className="text-sm text-white/50">Last Updated</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Tabs and Search */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab("workflows")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "workflows"
                    ? "bg-violet-500 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <WorkflowIcon className="w-4 h-4 inline mr-2" />
                  Workflows
                </button>
                <button
                  onClick={() => setActiveTab("agents")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "agents"
                    ? "bg-emerald-500 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Bot className="w-4 h-4 inline mr-2" />
                  Agents
                </button>
              </div>

              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Workflows Tab */}
            {activeTab === "workflows" && (
              <>
                {filteredWorkflows.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 mx-auto mb-6 flex items-center justify-center">
                      <WorkflowIcon className="w-10 h-10 text-white/30" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white/80">No workflows yet</h3>
                    <p className="text-white/50 mb-6">Create your first AI workflow to get started</p>
                    <Button
                      onClick={() => setShowCreateWorkflowModal(true)}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Workflow
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkflows.map((workflow) => (
                      <button
                        key={workflow.id}
                        onClick={() => router.push(`/workflow/${workflow.id}`)}
                        className={`group relative bg-gradient-to-br ${getCategoryColor(workflow.category)} backdrop-blur-xl border rounded-2xl p-6 text-left transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/10`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryIconBg(workflow.category)} flex items-center justify-center`}
                          >
                            {getCategoryIcon(workflow.category)}
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                        </div>

                        <h3 className="text-lg font-semibold mb-2 text-white">{workflow.name}</h3>

                        {workflow.description && (
                          <p className="text-sm text-white/60 mb-4 line-clamp-2">{workflow.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <div className="flex items-center gap-1">
                            <WorkflowIcon className="w-3 h-3" />
                            {workflow.nodes?.length || 0} nodes
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(workflow.updatedAt).toLocaleDateString()}
                          </div>
                        </div>

                        {workflow.category && (
                          <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">
                            {workflow.category}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Agents Tab */}
            {activeTab === "agents" && (
              <>
                {filteredAgents.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 mx-auto mb-6 flex items-center justify-center">
                      <Bot className="w-10 h-10 text-white/30" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white/80">No agents yet</h3>
                    <p className="text-white/50 mb-6">Create your first AI agent to get started</p>
                    <Button
                      onClick={() => setShowCreateAgentModal(true)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Agent
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => router.push(`/agent/${agent.id}`)}
                        className={`group relative bg-gradient-to-br ${getCategoryColor(agent.category)} backdrop-blur-xl border rounded-2xl p-6 text-left transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryIconBg(agent.category)} flex items-center justify-center`}
                          >
                            {getCategoryIcon(agent.category)}
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                        </div>

                        <h3 className="text-lg font-semibold mb-2 text-white">{agent.name}</h3>

                        {agent.description && (
                          <p className="text-sm text-white/60 mb-4 line-clamp-2">{agent.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <div className="flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            {agent.model?.split("/")[1] || "GPT-5"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(agent.updatedAt).toLocaleDateString()}
                          </div>
                        </div>

                        {agent.category && (
                          <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">
                            {agent.category}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {showCreateWorkflowModal && (
        <CreateWorkflowModal
          onClose={() => setShowCreateWorkflowModal(false)}
          onCreate={(workflowId) => {
            setShowCreateWorkflowModal(false)
            router.push(`/workflow/${workflowId}`)
          }}
        />
      )}

      {showCreateAgentModal && (
        <CreateAgentModal
          onClose={() => setShowCreateAgentModal(false)}
          onCreate={(agentId) => {
            setShowCreateAgentModal(false)
            router.push(`/agent/${agentId}`)
          }}
        />
      )}
    </div>
  )
}
