import { PARAM_DEFS, type Classification, type Lead, type ParamKey, type ParamScore } from './types'

export function emptyScores(): Record<ParamKey, ParamScore> {
  const scores = {} as Record<ParamKey, ParamScore>
  for (const def of PARAM_DEFS) {
    scores[def.key] = { score: 5, nota: '', sinDatos: false }
  }
  return scores
}

export function newLead(nombre: string, fuente: string): Lead {
  return {
    id: crypto.randomUUID(),
    nombre,
    fuente,
    fechaCreacion: new Date().toISOString(),
    conversacion: '',
    scores: emptyScores(),
    retiroExplicito: false,
    notasRetiro: '',
    notasGenerales: '',
  }
}

export function computeAverage(scores: Record<ParamKey, ParamScore>): number {
  const values = PARAM_DEFS.map((def) => scores[def.key].score)
  const sum = values.reduce((a, b) => a + b, 0)
  return sum / values.length
}

export function classify(average: number, retiroExplicito: boolean): Classification {
  if (retiroExplicito) return 'Frío/Perdido'
  if (average < 4) return 'Frío'
  if (average < 7) return 'Tibio'
  return 'Caliente'
}

export const CLASSIFICATION_BADGE_CLASS: Record<Classification, string> = {
  'Frío': 'badge badge--frio',
  'Tibio': 'badge badge--tibio',
  'Caliente': 'badge badge--caliente',
  'Frío/Perdido': 'badge badge--perdido',
}

export function leadSummary(lead: Lead) {
  const average = computeAverage(lead.scores)
  const classification = classify(average, lead.retiroExplicito)
  return { average, classification }
}
