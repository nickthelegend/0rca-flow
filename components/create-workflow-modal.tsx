"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"

const categories = [
  { name: "Data Processing", icon: "🔄", description: "Transform and process data" },
  { name: "Content Generation", icon: "✨", description: "Create AI-powered content" },
  { name: "API Integration", icon: "🔌", description: "Connect external services" },
  { name: "Business Automation", icon: "⚡", description: "Automate business processes" },
]

interface CreateWorkflowModalProps {
  onClose: () => void
  onCreate: (workflowId: string) => void
}

export function CreateWorkflowModal({ onClose, onCreate }: CreateWorkflowModalProps) {
  const [step, setStep] = useState(1)
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const handleCreate = () => {
    const workflowId = `workflow-${Date.now()}`
    const workflowData = {
      id: workflowId,
      name: workflowName || "Untitled Workflow",
      description: workflowDescription,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [
        {
          id: "1",
          type: "start",
          position: { x: 50, y: 250 },
          data: {},
        },
      ],
      edges: [],
    }

    localStorage.setItem(workflowId, JSON.stringify(workflowData))
    onCreate(workflowId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />

        {/* Modal Content */}
        <div className="relative bg-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Workflow</h2>
                <p className="text-sm text-white/50">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step Content */}
          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What's your workflow name?</h3>
                  <p className="text-sm text-white/50 mb-4">Give your workflow a descriptive name</p>
                  <Input
                    placeholder="e.g., Customer Data Pipeline"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 text-lg"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What does it do?</h3>
                  <p className="text-sm text-white/50 mb-4">Describe the purpose of this workflow (optional)</p>
                  <Textarea
                    placeholder="e.g., Processes customer data from API, validates it, and stores in database"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-32 resize-none"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Choose a category</h3>
                  <p className="text-sm text-white/50 mb-6">Help organize your workflows</p>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${
                          selectedCategory === category.name
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-3xl mb-3">{category.icon}</div>
                        <div className="text-white font-medium mb-1">{category.name}</div>
                        <div className="text-sm text-white/50">{category.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/5 bg-white/[0.02]">
            <Button
              variant="ghost"
              onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step > 1 ? "Back" : "Cancel"}
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !workflowName.trim()}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={!selectedCategory}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Workflow
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
