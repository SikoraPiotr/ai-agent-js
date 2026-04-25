import { createAnswerCache } from './answerCache'
import { runLLM } from './llm'
import { createConversationMemory } from './memory'
import {
  buildCacheKey,
  compactUserMessageForModel,
  decideIfQuestionIsWorthTokens,
} from './queryPolicy'
import { SYSTEM_PROMPT } from './systemPrompt'

const answerCache = createAnswerCache()

export const runAgent = async ({ userMessage }: { userMessage: string }) => {
  const memory = createConversationMemory([{ role: 'system', content: SYSTEM_PROMPT }])

  const decision = decideIfQuestionIsWorthTokens(userMessage)

  if (!decision.shouldCallModel) {
    const quickResponse = decision.response ?? 'Podaj proszę więcej szczegółów.'

    memory.add({ role: 'user', content: userMessage })
    memory.add({ role: 'assistant', content: quickResponse })

    return {
      response: quickResponse,
      messages: memory.getAll(),
      meta: { source: 'policy' as const, reason: decision.reason },
    }
  }

  const compactedMessage = compactUserMessageForModel(userMessage)
  const cacheKey = buildCacheKey(compactedMessage)
  const cachedResponse = answerCache.get(cacheKey)

  memory.add({ role: 'user', content: compactedMessage })

  if (cachedResponse) {
    memory.add({ role: 'assistant', content: cachedResponse })

    return {
      response: cachedResponse,
      messages: memory.getAll(),
      meta: { source: 'cache' as const, reason: 'cache_hit' as const },
    }
  }

  const assistantMessage = await runLLM({ messages: memory.getAll() })

  answerCache.set(cacheKey, assistantMessage)
  memory.add({ role: 'assistant', content: assistantMessage })

  return {
    response: assistantMessage,
    messages: memory.getAll(),
    meta: { source: 'model' as const, reason: 'normal' as const },
  }
}
