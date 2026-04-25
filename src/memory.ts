import type { AIMessage } from '../types'

export const createConversationMemory = (initialMessages: AIMessage[] = []) => {
  const messages = [...initialMessages]

  return {
    add: (message: AIMessage) => {
      messages.push(message)
    },
    getAll: () => [...messages],
  }
}
