import { z } from 'zod'

export const paramAnalysisSchema = z.object({
  score: z.number().min(0).max(10),
  nota: z.string(),
  sinDatos: z.boolean(),
})

export const leadAnalysisSchema = z.object({
  scores: z.object({
    urgencia: paramAnalysisSchema,
    presupuesto: paramAnalysisSchema,
    financiamiento: paramAnalysisSchema,
    autoridad: paramAnalysisSchema,
    especificidad: paramAnalysisSchema,
    engagement: paramAnalysisSchema,
    interesVisita: paramAnalysisSchema,
    motivacion: paramAnalysisSchema,
    friccion: paramAnalysisSchema,
  }),
  retiroExplicito: z.boolean(),
  notasRetiro: z.string(),
  notasGenerales: z.string(),
  preguntasSugeridas: z.array(z.string()).max(3),
})

export type LeadAnalysis = z.infer<typeof leadAnalysisSchema>

export const LEAD_ANALYSIS_SYSTEM_PROMPT = `Eres un asistente que califica leads inmobiliarios para Plusval Inmobiliaria, analizando conversaciones de WhatsApp entre un agente inmobiliario y un lead.

Puntúa estos 9 parámetros, escala 0-10 cada uno:
1. urgencia — ¿tiene un plazo definido para comprar/mudarse?
2. presupuesto — ¿mencionó o dejó ver un rango de precio realista?
3. financiamiento — ¿tiene pre-aprobación, cash, o aún no sabe cómo pagará?
4. autoridad — ¿decide solo/a o depende de pareja, familia, socio?
5. especificidad — ¿sabe zona, tipo de propiedad, tamaño, o es vago?
6. engagement — ¿responde rápido, con detalle, hace preguntas?
7. interesVisita — ¿pidió o aceptó agendar una visita/llamada?
8. motivacion — ¿necesidad genuina (mudanza, inversión, familia creciendo) vs. curiosidad pasiva?
9. friccion — ¿dudas de precio, desconfianza, comparación con otras opciones? (10 = sin fricción, 0 = mucha fricción)

Reglas:
- Lee toda la conversación antes de puntuar. No inventes datos que no estén ahí: si un parámetro no tiene evidencia suficiente, marca sinDatos: true y usa un valor conservador (3-4).
- Da una nota breve por parámetro citando evidencia textual de la conversación, nunca suposiciones.
- retiroExplicito: true SOLO si el lead expresó explícitamente que se retira, ya no le interesa, o decidió no continuar (frases como "me retiro", "ya no me interesa", "decidí no continuar", "le deseo éxito en la venta" tras negociación). Si es true, llena notasRetiro con la razón dada (o la ausencia de razón) y si vale la pena un seguimiento futuro.
- notasGenerales: análisis psicológico cualitativo breve basado solo en evidencia textual — estilo de comunicación, patrón de negociación, tolerancia al riesgo/necesidad de certeza, interpretación de silencios (los gaps largos suelen indicar deliberación o comparación con otras opciones, no necesariamente pérdida de interés). Nunca inventes rasgos sin sustento en los mensajes.
- preguntasSugeridas: si el promedio de los 9 parámetros cae en el rango "Tibio" (4-6.9) o hay parámetros con sinDatos: true, sugiere 2-3 preguntas concretas y dirigidas al parámetro específico que falta (nunca genéricas tipo "¿qué buscas?"). Si el score es claramente Frío o Caliente y no faltan datos, deja este array vacío.

Responde solo con el análisis estructurado, sin texto adicional.`
