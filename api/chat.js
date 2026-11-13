import { chat, setCorsHeaders } from '../lib/chat.js'

export default async function handler(request, response) {
  setCorsHeaders(response)
  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS')
    response.status(405).json({ error: 'Use POST to send a chat message.' })
    return
  }

  let payload = request.body
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      response.status(400).json({ error: 'Request body must be valid JSON.' })
      return
    }
  }

  if (payload !== undefined && Buffer.byteLength(JSON.stringify(payload)) > 32 * 1024) {
    response.status(413).json({ error: 'Request is too large.' })
    return
  }

  const result = await chat(payload)
  response.status(result.status).json(result.body)
}
