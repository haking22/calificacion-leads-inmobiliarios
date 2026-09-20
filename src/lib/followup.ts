import { addDays, format } from 'date-fns'
import type { FollowUpPlan, Touch } from './types'

const TOTAL_TOUCHES = 32
const SPACING_DAYS = 365 / TOTAL_TOUCHES // ~11.4 días

export function generatePlan(leadId: string, leadNombre: string, startDate: Date, hora: string): FollowUpPlan {
  const touches: Touch[] = Array.from({ length: TOTAL_TOUCHES }, (_, i) => {
    const date = addDays(startDate, Math.round(i * SPACING_DAYS))
    return {
      id: crypto.randomUUID(),
      index: i + 1,
      date: format(date, 'yyyy-MM-dd'),
      title: `Seguimiento ${leadNombre} — toque ${i + 1}`,
      note: '',
      done: false,
    }
  })

  return {
    id: crypto.randomUUID(),
    leadId,
    leadNombre,
    startDate: format(startDate, 'yyyy-MM-dd'),
    hora,
    touches,
  }
}
