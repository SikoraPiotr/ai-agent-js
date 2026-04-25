import type { ToolFn } from '../types'

export const runTool = async <A, T>({
  toolName,
  tools,
  userMessage,
  toolArgs,
}: {
  toolName: string
  tools: Record<string, ToolFn<any, any>>
  userMessage: string
  toolArgs: A
}): Promise<T> => {
  const tool = tools[toolName]

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`)
  }

  return tool({ userMessage, toolArgs }) as Promise<T>
}
