"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Wrench, Settings, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"

const PREDEFINED_TOOLS = [
    { id: "DirectoryReadTool", name: "Directory Read", description: "Read files from a directory" },
    { id: "FileReadTool", name: "File Read", description: "Read content from a specific file" },
    { id: "SerperDevTool", name: "Serper Search", description: "Google Search via Serper.dev" },
    { id: "WebsiteSearchTool", name: "Website Search", description: "Search content within a website" },
    { id: "CodeInterpreterTool", name: "Code Interpreter", description: "Execute Python code in a sandbox" },
    { id: "GithubSearchTool", name: "GitHub Search", description: "Search code and issues in GitHub" },
    { id: "PDFSearchTool", name: "PDF Search", description: "RAG tool for PDF documents" },
    { id: "ScrapeWebsiteTool", name: "Scrape Website", description: "Scrape entire website content" },
    { id: "BrowserbaseLoadTool", name: "Browserbase", description: "Headless browser interaction" },
    { id: "FirecrawlSearchTool", name: "Firecrawl Search", description: "Crawl and search webpages" },
    { id: "YoutubeVideoSearchTool", name: "YouTube Search", description: "Search within YouTube videos" },
    { id: "ApifyActorsTool", name: "Apify Actors", description: "Web scraping and automation tasks" },
    { id: "CodeDocsSearchTool", name: "Code Docs Search", description: "Search through code documentation" },
    { id: "CSVSearchTool", name: "CSV Search", description: "Search within CSV files" },
    { id: "DirectorySearchTool", name: "Directory Search", description: "Search within directory structures" },
    { id: "DOCXSearchTool", name: "DOCX Search", description: "Search within Word documents" },
    { id: "EXASearchTool", name: "EXA Search", description: "Perform exhaustive data searches" },
    { id: "JSONSearchTool", name: "JSON Search", description: "Search within JSON files" },
    { id: "MDXSearchTool", name: "MDX Search", description: "Search within Markdown files" },
    { id: "PGSearchTool", name: "PG Search", description: "Search within PostgreSQL databases" },
    { id: "VisionTool", name: "Vision Tool", description: "Image analysis capabilities" },
    { id: "XMLSearchTool", name: "XML Search", description: "Search within XML files" },
    { id: "YoutubeChannelSearchTool", name: "YouTube Channel Search", description: "Search within YouTube channels" }
]

export function CrewAIToolNode({ id, data, selected }: NodeProps) {
    const [isOpen, setIsOpen] = useState(false)

    const selectedToolId = (data as any).toolId || PREDEFINED_TOOLS[0].id
    const selectedTool = PREDEFINED_TOOLS.find(t => t.id === selectedToolId) || PREDEFINED_TOOLS[0]

    return (
        <div className="relative group">
            <div className={`p-0.5 rounded-xl bg-gradient-to-br from-amber-500/50 to-orange-600/50 transition-all ${selected ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/20' : 'hover:scale-[1.02]'}`}>
                <Card className="min-w-[260px] bg-[#0f0f1a] border-none text-white overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-white/5 border-b border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                            <Wrench className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold tracking-tight">CrewAI Tool</h3>
                            <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest mt-0.5">Native Capabilities</div>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="relative">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block">Select Tool</label>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors"
                                type="button"
                            >
                                <span className="truncate">{selectedTool.name}</span>
                                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl max-h-48 overflow-y-auto">
                                    {PREDEFINED_TOOLS.map(tool => (
                                        <button
                                            key={tool.id}
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-amber-500/20 transition-colors flex flex-col gap-0.5"
                                            onClick={() => {
                                                (data as any).toolId = tool.id;
                                                setIsOpen(false);
                                            }}
                                        >
                                            <span className="font-bold text-white">{tool.name}</span>
                                            <span className="text-[10px] text-white/40 truncate">{tool.description}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[11px] text-white/60 leading-relaxed italic line-clamp-2">
                                {selectedTool.description}
                            </p>
                        </div>
                    </div>

                    {/* Connections */}
                    <Handle
                        type="source"
                        position={Position.Top}
                        id="output"
                        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-amber-400"
                    />
                </Card>
            </div>
        </div>
    )
}

export default memo(CrewAIToolNode)
