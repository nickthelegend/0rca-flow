"use server"

import { generateText } from "ai"

export async function sendMessageToAI(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `You are an AI assistant helping users build AI agent workflows. The user said: "${prompt}". Provide helpful, concise guidance about creating nodes, connecting them, or workflow best practices.`,
  })
  return text
}
