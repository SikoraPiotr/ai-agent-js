import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { runTool } from '../src/toolRunner'

describe('runTool', () => {
  it('runs the selected tool with userMessage and toolArgs', async () => {
    const tools = {
      echo: async ({ userMessage, toolArgs }: { userMessage: string; toolArgs: { suffix: string } }) => {
        return `${userMessage}-${toolArgs.suffix}`
      },
    }

    const result = await runTool({
      toolName: 'echo',
      tools,
      userMessage: 'hello',
      toolArgs: { suffix: 'world' },
    })

    assert.equal(result, 'hello-world')
  })

  it('throws when an unknown tool is requested', async () => {
    await assert.rejects(
      () =>
        runTool({
          toolName: 'missing',
          tools: {},
          userMessage: 'hello',
          toolArgs: {},
        }),
      /Unknown tool: missing/
    )
  })
})
