import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createConversationMemory } from '../src/memory'

describe('createConversationMemory', () => {
  it('stores initial and added messages in order', () => {
    const memory = createConversationMemory([{ role: 'system', content: 'System message' }])

    memory.add({ role: 'user', content: 'Hello' })
    memory.add({ role: 'assistant', content: 'Hi there' })

    assert.deepEqual(memory.getAll(), [
      { role: 'system', content: 'System message' },
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' },
    ])
  })

  it('returns a defensive copy of messages', () => {
    const memory = createConversationMemory([{ role: 'user', content: 'Hello' }])

    const firstRead = memory.getAll()
    firstRead.push({ role: 'assistant', content: 'Mutation attempt' })

    assert.deepEqual(memory.getAll(), [{ role: 'user', content: 'Hello' }])
  })
})
