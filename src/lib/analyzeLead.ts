import { leadAnalysisSchema, type LeadAnalysis } from './leadAnalysis'

export async function analyzeLeadConversation(conversation: string): Promise<LeadAnalysis> {
  const res = await fetch('/api/analyze-lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ conversation }),
  })

  const data: unknown = await res.json()

  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error
    throw new Error(message ?? 'Error al analizar la conversación')
  }

  return leadAnalysisSchema.parse(data)
}
