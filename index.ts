import 'dotenv/config'
import { runAgent } from './src/agent'

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

const result = await runAgent({ userMessage })

console.log(result.response)
