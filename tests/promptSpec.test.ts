import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildClarifyingQuestions,
  buildParaphrase,
  buildPromptBuildInput,
  extractPromptSpec,
  isSpecReady,
} from '../src/promptSpec'

describe('promptSpec', () => {
  it('extracts labeled prompt fields', () => {
    const spec = extractPromptSpec(
      'cel: napisz funkcję sortującą dane: lista liczb ograniczenia: TS bez bibliotek format: kod + testy kryteria: przechodzi edge case',
    )

    assert.equal(spec.goal, 'napisz funkcję sortującą')
    assert.equal(spec.inputData, 'lista liczb')
    assert.equal(spec.constraints, 'TS bez bibliotek')
    assert.equal(spec.outputFormat, 'kod + testy')
    assert.equal(spec.successCriteria, 'przechodzi edge case')
  })

  it('returns clarification questions when context is missing', () => {
    const spec = extractPromptSpec('zrób coś z kodem')
    const questions = buildClarifyingQuestions(spec)

    assert.ok(questions.length >= 1)
    assert.ok(questions.length <= 3)
    assert.equal(isSpecReady(spec), false)
  })

  it('builds paraphrase and enhanced build input', () => {
    const spec = extractPromptSpec('cel: oblicz NPV format: tabela + wnioski')

    assert.equal(buildParaphrase(spec), 'Rozumiem, że chcesz: oblicz NPV')

    const enhanced = buildPromptBuildInput({ userMessage: 'cel: oblicz NPV format: tabela + wnioski', spec })

    assert.match(enhanced, /FINALNY PROMPT/)
    assert.match(enhanced, /POMYSLY CROSS-DOMAIN/)
    assert.equal(isSpecReady(spec), true)
  })
})
