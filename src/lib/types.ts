export const PARAM_DEFS = [
  {
    key: 'urgencia',
    label: 'Urgencia',
    question: '¿Tiene un plazo definido para comprar/mudarse?',
  },
  {
    key: 'presupuesto',
    label: 'Presupuesto claro',
    question: '¿Mencionó o dejó ver un rango de precio realista?',
  },
  {
    key: 'financiamiento',
    label: 'Financiamiento',
    question: '¿Tiene pre-aprobación, cash, o aún no sabe cómo pagará?',
  },
  {
    key: 'autoridad',
    label: 'Autoridad de decisión',
    question: '¿Decide solo/a o depende de pareja, familia, socio?',
  },
  {
    key: 'especificidad',
    label: 'Especificidad de la búsqueda',
    question: '¿Sabe zona, tipo de propiedad, tamaño, o es vago?',
  },
  {
    key: 'engagement',
    label: 'Engagement en la conversación',
    question: '¿Responde rápido, con detalle, hace preguntas?',
  },
  {
    key: 'interesVisita',
    label: 'Interés en visitar',
    question: '¿Pidió o aceptó agendar una visita/llamada?',
  },
  {
    key: 'motivacion',
    label: 'Motivación real',
    question: '¿Necesidad genuina (mudanza, inversión, familia creciendo) vs. curiosidad pasiva?',
  },
  {
    key: 'friccion',
    label: 'Señales de objeción/fricción',
    question: '¿Dudas de precio, desconfianza, comparación con otras opciones? (10 = sin fricción, 0 = mucha fricción)',
  },
] as const

export type ParamKey = (typeof PARAM_DEFS)[number]['key']

export interface ParamScore {
  score: number
  nota: string
  sinDatos: boolean
}

export type Classification = 'Frío' | 'Tibio' | 'Caliente' | 'Frío/Perdido'

export interface Lead {
  id: string
  nombre: string
  fuente: string
  fechaCreacion: string
  scores: Record<ParamKey, ParamScore>
  retiroExplicito: boolean
  notasRetiro: string
  notasGenerales: string
}

export interface Touch {
  id: string
  index: number
  date: string
  title: string
  note: string
  done: boolean
}

export interface FollowUpPlan {
  id: string
  leadId: string
  leadNombre: string
  startDate: string
  hora: string
  touches: Touch[]
}
