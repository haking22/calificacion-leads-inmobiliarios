import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { LEAD_ANALYSIS_SYSTEM_PROMPT, leadAnalysisSchema } from '../src/lib/leadAnalysis.ts'

const MAX_CONVERSATION_CHARS = 20000

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405)
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: 'ANTHROPIC_API_KEY no está configurada en el servidor' }, 500)
  }

  let conversation: unknown
  try {
    const body = await request.json()
    conversation = (body as { conversation?: unknown })?.conversation
  } catch {
    return jsonResponse({ error: 'Body inválido, se esperaba JSON' }, 400)
  }

  if (typeof conversation !== 'string' || !conversation.trim()) {
    return jsonResponse({ error: 'Falta el texto de la conversación' }, 400)
  }

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 4096,
      system: LEAD_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Conversación con el lead:\n\n${conversation.slice(0, MAX_CONVERSATION_CHARS)}`,
        },
      ],
      output_config: {
        format: zodOutputFormat(leadAnalysisSchema, 'lead_analysis'),
      },
    })

    if (!response.parsed_output) {
      return jsonResponse({ error: 'No se pudo interpretar la respuesta del modelo' }, 502)
    }

    return jsonResponse(response.parsed_output, 200)
  } catch (err) {
    console.error('analyze-lead error', err)
    return jsonResponse({ error: 'Error al analizar la conversación' }, 500)
  }
}
