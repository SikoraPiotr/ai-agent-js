const GREETING_REGEX = /^(hej|cześć|czesc|siema|hello|hi|yo)\b[!.?\s]*$/i
const SHORT_ACK_REGEX = /^(ok|okej|dzięki|dzieki|thanks|spoko)\b[!.?\s]*$/i

export interface QueryDecision {
  shouldCallModel: boolean
  reason: 'normal' | 'greeting' | 'ack' | 'empty'
  response?: string
}

export const decideIfQuestionIsWorthTokens = (userMessage: string): QueryDecision => {
  const trimmed = userMessage.trim()

  if (!trimmed) {
    return {
      shouldCallModel: false,
      reason: 'empty',
      response: 'Napisz proszę konkretny cel, a pomogę ułożyć dobry prompt.',
    }
  }

  if (GREETING_REGEX.test(trimmed)) {
    return {
      shouldCallModel: false,
      reason: 'greeting',
      response:
        'Hej! Napisz co chcesz osiągnąć, dla jakiego modelu i w jakim formacie ma być odpowiedź — zbuduję z tego skuteczny prompt.',
    }
  }

  if (SHORT_ACK_REGEX.test(trimmed)) {
    return {
      shouldCallModel: false,
      reason: 'ack',
      response: 'Jasne — podeślij temat/zadanie, a przygotuję gotowy prompt.',
    }
  }

  return { shouldCallModel: true, reason: 'normal' }
}

export const compactUserMessageForModel = (userMessage: string, maxChars = 1200) => {
  const compacted = userMessage.replace(/\s+/g, ' ').trim()

  if (compacted.length <= maxChars) {
    return compacted
  }

  const head = compacted.slice(0, Math.floor(maxChars * 0.75))
  const tail = compacted.slice(-Math.floor(maxChars * 0.2))

  return `${head} ... [skrócono długi opis, zachowano początek i koniec] ... ${tail}`
}

export const buildCacheKey = (userMessage: string) =>
  compactUserMessageForModel(userMessage, 800).toLocaleLowerCase('pl-PL')
