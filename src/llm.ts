import type { AIMessage } from '../types'
import { openai } from './ai'

export const runLLM = async ({ messages }: { messages: AIMessage[] }) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.1,
    messages,
  })

  const content = response.choices[0]?.message?.content

  if (!content) {
    throw new Error('Model returned an empty response.')
  }

  return content
}
