import { getHealth, setCorsHeaders } from '../lib/chat.js'

export default function handler(request, response) {
  setCorsHeaders(response)
  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET, OPTIONS')
    response.status(405).json({ error: 'Use GET to check API health.' })
    return
  }

  response.status(200).json(getHealth())
}
