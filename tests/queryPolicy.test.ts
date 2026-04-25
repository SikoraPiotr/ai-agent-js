import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildCacheKey,
  compactUserMessageForModel,
  decideIfQuestionIsWorthTokens,
} from '../src/queryPolicy'

describe('queryPolicy', () => {
  it('skips model call for greetings', () => {
    const decision = decideIfQuestionIsWorthTokens('hej')

    assert.equal(decision.shouldCallModel, false)
    assert.equal(decision.reason, 'greeting')
    assert.ok(decision.response)
  })

  it('allows normal question', () => {
    const decision = decideIfQuestionIsWorthTokens('Stwórz prompt do analizy konkurencji SaaS')

    assert.equal(decision.shouldCallModel, true)
    assert.equal(decision.reason, 'normal')
  })

  it('compacts very long message', () => {
    const long = `${'abc '.repeat(500)}koniec`
    const compacted = compactUserMessageForModel(long, 100)

    assert.ok(compacted.length <= 200)
    assert.match(compacted, /skrócono długi opis/)
    assert.match(compacted, /koniec$/)
  })

  it('builds stable cache key', () => {
    const first = buildCacheKey('  ALA    ma kota  ')
    const second = buildCacheKey('ala ma kota')

    assert.equal(first, second)
  })
})
