import OpenAI from 'openai'

export type AIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam

export interface ToolFn<A = unknown, T = unknown> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>
}
