import { runLLM } from './llm'
import { createConversationMemory } from './memory'
import { SYSTEM_PROMPT } from './systemPrompt'

export const runAgent = async ({ userMessage }: { userMessage: string }) => {
  const memory = createConversationMemory([{ role: 'system', content: SYSTEM_PROMPT }])

  memory.add({ role: 'user', content: userMessage })

  const assistantMessage = await runLLM({ messages: memory.getAll() })

  memory.add({ role: 'assistant', content: assistantMessage })

  return {
    response: assistantMessage,
    messages: memory.getAll(),
  }
}
