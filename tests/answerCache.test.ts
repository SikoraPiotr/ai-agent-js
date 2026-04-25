import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createAnswerCache } from '../src/answerCache'

describe('answerCache', () => {
  it('stores and returns cached response', () => {
    const cache = createAnswerCache()

    cache.set('k1', 'v1')

    assert.equal(cache.get('k1'), 'v1')
    assert.equal(cache.size(), 1)
  })

  it('expires entries by ttl', async () => {
    const cache = createAnswerCache({ ttlMs: 10 })

    cache.set('k1', 'v1')

    await new Promise((resolve) => setTimeout(resolve, 20))

    assert.equal(cache.get('k1'), null)
  })
})
