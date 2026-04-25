# Prompt Coach CLI (AI Agent in progress)

To repo zaczynało jako materiał do warsztatu "Build an AI Agent from Scratch", a teraz rozwijamy je w kierunku:

**AI, które pomaga pisać lepsze prompty dla innego AI.**

## Dlaczego ten kierunek

Dobre odpowiedzi modeli zależą od jakości pytania. Celem projektu jest budowa "Prompt Coacha", który:
- wyciąga właściwy kontekst od użytkownika,
- wykrywa luki w wymaganiach,
- generuje gotowe prompty w powtarzalnym, praktycznym formacie,
- tłumaczy dlaczego dany prompt ma szansę zadziałać.

## Setup

Wymagania:
- Node.js 20+ albo bun v1.0.20+
- klucz OpenAI API

```bash
git clone https://github.com/Hendrixer/agent-from-scratch.git
cd agent-from-scratch
npm install
```

## Run

```bash
npm start -- "Chcę prompt do wygenerowania landing page dla SaaS B2B"
# lub
bun run index.ts "Chcę prompt do wygenerowania landing page dla SaaS B2B"
```

## Scripts

```bash
npm run typecheck
npm test
```

## OpenAI API Key

Dodaj `.env`:

```bash
OPENAI_API_KEY='YOUR_API_KEY'
```

## Aktualne MVP

- `index.ts` odbiera wiadomość CLI i uruchamia agenta.
- `src/agent.ts` składa konwersację (system + user), woła model i zwraca odpowiedź.
- `src/systemPrompt.ts` definiuje zachowanie Prompt Coacha (dopytanie -> gotowy prompt).
- `src/memory.ts` trzyma historię wiadomości w pamięci procesu.
- `src/toolRunner.ts` to podstawowy runner narzędzi pod kolejne kroki.

## Optymalizacja tokenów (obecnie)

Agent ma teraz prostą warstwę kontroli kosztu:
- **Policy gate**: krótkie wiadomości typu "hej", "ok" albo pusty input są obsługiwane bez wywołania modelu.
- **Compaction**: długie wiadomości są automatycznie kompresowane (usuwanie nadmiarowych białych znaków + skrócenie bardzo długiego opisu).
- **Cache odpowiedzi**: powtarzalne pytania (po normalizacji) mogą zostać obsłużone z cache in-memory (TTL 15 min), bez ponownego kosztu LLM.

## Proponowana roadmapa (następne kroki)

1. **Tryb iteracyjny promptowania**
   - komendy `/improve`, `/shorten`, `/more-creative`, `/strict-json`.
2. **Biblioteka szablonów**
   - gotowe szkielety promptów dla: kodu, marketingu, analizy danych, UX.
3. **Ocena jakości promptu**
   - scoring: precyzja, kompletność, testowalność, ryzyko halucynacji.
4. **Pamięć sesji**
   - zapis sesji promptowych do `lowdb` z historią iteracji.
5. **Tooling research**
   - narzędzia do szybkiego zbierania kontekstu z URL / dokumentu.
