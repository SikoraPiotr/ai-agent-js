# Build an AI Agent from Scratch Workshop

- Watch the workshop on [Frontend Masters](https://frontendmasters.com/workshops/build-ai-agent/).
- View the [course notes](https://clumsy-humor-894.notion.site/Agent-from-scratch-13554fed51a380749554c44aa8989406?pvs=4)

## Setup Instructions

This repo requires **Node.js version 20+** or **bun v1.0.20**.

The `main` branch contains the final application. To code along with the workshop, checkout the `step/1` branch. You will also need an [API Key from OpenAI](https://platform.openai.com/settings/organization/api-keys).

```bash
git clone https://github.com/Hendrixer/agent-from-scratch.git
cd agent-from-scratch
git checkout step/1
npm install # or bun install
```

## Run

```bash
npm start -- "Twoje pytanie"
# or
bun run index.ts "Twoje pytanie"
```

## Scripts

```bash
npm run typecheck
npm test
```

## OpenAI API Key

Create an [API Key from OpenAI](https://platform.openai.com/settings/organization/api-keys) and save it in a `.env` file:

```bash
OPENAI_API_KEY='YOUR_API_KEY'
```

## Current MVP architecture

- `index.ts` handles CLI input and runs `runAgent`.
- `src/agent.ts` composes the conversation (system + user), calls the LLM, and returns answer + history.
- `src/memory.ts` stores in-memory conversation messages.
- `src/llm.ts` sends messages to OpenAI and validates non-empty responses.
- `src/toolRunner.ts` contains the base tool execution helper.
