import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Providers from "@/components/providers"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "AI Agent Builder - Visual Workflow Builder for AI SDK",
    template: "%s | AI Agent Builder",
  },
  description:
    "Build powerful AI workflows visually with drag-and-drop nodes. Chain prompts, models, conditionals, and more. Export to production-ready AI SDK code.",
  keywords: [
    "AI",
    "AI SDK",
    "workflow builder",
    "visual programming",
    "no-code",
    "low-code",
    "AI agents",
    "LLM",
    "OpenAI",
    "Gemini",
    "React Flow",
  ],
  authors: [{ name: "v0" }],
  creator: "v0",
  publisher: "v0",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://v0-generated-agent-builder.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "AI Agent Builder - Visual Workflow Builder for AI SDK",
    description:
      "Build powerful AI workflows visually with drag-and-drop nodes. Chain prompts, models, conditionals, and more. Export to production-ready AI SDK code.",
    siteName: "AI Agent Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Builder - Visual Workflow Builder for AI SDK",
    description:
      "Build powerful AI workflows visually with drag-and-drop nodes. Chain prompts, models, conditionals, and more.",
    creator: "@vercel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
