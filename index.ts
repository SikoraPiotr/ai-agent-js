import 'dotenv/config'
import { runLLM } from './src/llm'

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}


const response = await runLLM({userMessage});

console.log(response);