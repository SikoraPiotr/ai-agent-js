export interface PromptSpec {
  goal: string
  inputData: string
  constraints: string
  outputFormat: string
  successCriteria: string
  domain: 'code_and_calculations'
  userThinkingStyle: string
}

const EMPTY_SPEC: PromptSpec = {
  goal: '',
  inputData: '',
  constraints: '',
  outputFormat: '',
  successCriteria: '',
  domain: 'code_and_calculations',
  userThinkingStyle: '',
}

const pickFirst = (patterns: RegExp[], source: string) => {
  for (const pattern of patterns) {
    const match = source.match(pattern)
    const value = match?.[1]?.trim()

    if (value) {
      return value
    }
  }

  return ''
}

export const extractPromptSpec = (userMessage: string): PromptSpec => {
  const normalized = userMessage.replace(/\s+/g, ' ').trim()

  return {
    ...EMPTY_SPEC,
    goal: pickFirst(
      [
        /(?:cel|goal)\s*[:\-]\s*(.+?)(?=(?:\s+(?:dane|input|format|ograniczenia|kryteria)\s*[:\-])|$)/i,
        /(?:chcę|chce|potrzebuję|zbuduj|stwórz)\s+(.+)/i,
      ],
      normalized,
    ),
    inputData: pickFirst(
      [/(?:dane|input|wejście|wejscie)\s*[:\-]\s*(.+?)(?=(?:\s+(?:format|ograniczenia|kryteria)\s*[:\-])|$)/i],
      normalized,
    ),
    constraints: pickFirst(
      [/(?:ograniczenia|constraints?)\s*[:\-]\s*(.+?)(?=(?:\s+(?:format|kryteria)\s*[:\-])|$)/i],
      normalized,
    ),
    outputFormat: pickFirst(
      [/(?:format|output)\s*[:\-]\s*(.+?)(?=(?:\s+(?:kryteria)\s*[:\-])|$)/i],
      normalized,
    ),
    successCriteria: pickFirst([/(?:kryteria|definition of done|dod)\s*[:\-]\s*(.+)$/i], normalized),
    userThinkingStyle: pickFirst([/(?:styl|thinking|sposób myślenia|sposob myslenia)\s*[:\-]\s*(.+)$/i], normalized),
  }
}

export const buildClarifyingQuestions = (spec: PromptSpec) => {
  const questions: string[] = []

  if (!spec.goal) {
    questions.push('Jaki jest dokładny cel zadania (co ma być policzone lub zaimplementowane)?')
  }

  if (!spec.inputData) {
    questions.push('Jakie są dane wejściowe, zakres i przykładowe przypadki testowe?')
  }

  if (!spec.outputFormat) {
    questions.push('W jakim formacie chcesz wynik (np. kod, tabela, kroki obliczeń, JSON)?')
  }

  if (!spec.successCriteria) {
    questions.push('Po czym poznasz, że odpowiedź jest dobra (kryteria jakości / Definition of Done)?')
  }

  return questions.slice(0, 3)
}

export const isSpecReady = (spec: PromptSpec) => Boolean(spec.goal && spec.outputFormat)

export const buildParaphrase = (spec: PromptSpec) => {
  if (!spec.goal) {
    return 'Rozumiem, że chcesz dopracować prompt do zadania z kodu/obliczeń.'
  }

  return `Rozumiem, że chcesz: ${spec.goal}`
}

export const buildPromptBuildInput = ({ userMessage, spec }: { userMessage: string; spec: PromptSpec }) => {
  return [
    'ZADANIE: zbuduj najlepszy możliwy prompt dla innego AI (obszar: kod + obliczenia).',
    `ORIGINAL_USER_MESSAGE: ${userMessage}`,
    `CEL: ${spec.goal || 'brak'}`,
    `DANE_WEJSCIOWE: ${spec.inputData || 'brak'}`,
    `OGRANICZENIA: ${spec.constraints || 'brak'}`,
    `FORMAT_WYNIKU: ${spec.outputFormat || 'brak'}`,
    `KRYTERIA_JAKOSCI: ${spec.successCriteria || 'brak'}`,
    `STYL_UZYTKOWNIKA: ${spec.userThinkingStyle || 'brak'}`,
    'ZWROC WYNIK W SEKCJACH: 1) FINALNY PROMPT 2) ANTY-PROMPT 3) CHECKLISTA 4) 2 POMYSLY CROSS-DOMAIN',
  ].join('\n')
}
