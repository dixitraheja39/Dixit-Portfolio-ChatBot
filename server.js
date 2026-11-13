import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createServer } from 'node:http'
import { chat, getHealth, setCorsHeaders } from './lib/chat.js'

const root = dirname(fileURLToPath(import.meta.url))
const envFile = join(root, '.env')
const port = Number(process.env.API_PORT || 3001)
const maxBodyBytes = 32 * 1024

function localDotEnv() {
  if (!existsSync(envFile)) return
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(GEMINI_API_KEY|GEMINI_MODEL|OPENAI_API_KEY|OPENAI_MODEL|API_PORT)\s*=\s*(.*)\s*$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
    }
  }
}

async function readJson(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (Buffer.byteLength(body) > maxBodyBytes) {
      const error = new Error('Request is too large.')
      error.status = 413
      throw error
    }
  }
  try {
    return JSON.parse(body)
  } catch {
    const error = new Error('Request body must be valid JSON.')
    error.status = 400
    throw error
  }
}

localDotEnv()

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname
  if (pathname === '/api/chat' || pathname === '/api/health') {
    setCorsHeaders(response)
    if (request.method === 'OPTIONS') {
      response.writeHead(204)
      response.end()
      return
    }
  }

  if (pathname === '/api/health') {
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET, OPTIONS')
      response.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' })
      response.end(JSON.stringify({ error: 'Use GET to check API health.' }))
      return
    }
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify(getHealth()))
    return
  }

  if (pathname !== '/api/chat') {
    response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ error: 'Endpoint not found.' }))
    return
  }
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS')
    response.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ error: 'Use POST to send a chat message.' }))
    return
  }

  try {
    const result = await chat(await readJson(request))
    response.writeHead(result.status, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify(result.body))
  } catch (error) {
    response.writeHead(error.status || 500, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ error: error.status ? error.message : 'The chat service encountered an unexpected error.' }))
  }
})

server.listen(port, () => {
  console.log(`Chat API listening on http://localhost:${port}`)
})
