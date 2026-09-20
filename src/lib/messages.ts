export type Tono = 'cercano' | 'formal' | 'urgencia'

export interface MessageInput {
  nombreLead: string
  anuncio: string
  propiedad: string
  ubicacion: string
  precio: string
  tono: Tono
}

export interface MessageVariant {
  angulo: 'Directo' | 'Cálido/personalizado' | 'Urgencia/escasez'
  texto: string
}

function withPlaceholder(value: string, placeholder: string): string {
  return value.trim() ? value.trim() : `[${placeholder}]`
}

function saludo(nombreLead: string, tono: Tono): string {
  const nombre = nombreLead.trim()
  if (tono === 'formal') return nombre ? `Buenas tardes, ${nombre}.` : 'Buenas tardes.'
  return nombre ? `¡Hola, ${nombre}!` : '¡Hola!'
}

export function generateMessages(input: MessageInput): MessageVariant[] {
  const propiedad = withPlaceholder(input.propiedad, 'tipo de propiedad')
  const ubicacion = withPlaceholder(input.ubicacion, 'ubicación')
  const precio = withPlaceholder(input.precio, 'precio')
  const anuncio = withPlaceholder(input.anuncio, 'nombre del anuncio')
  const saludoBase = saludo(input.nombreLead, input.tono)

  const directo: MessageVariant = {
    angulo: 'Directo',
    texto: `${saludoBase} Te escribo por tu interés en ${propiedad} en ${ubicacion} que viste en nuestro anuncio "${anuncio}". ¿Todavía te interesa? Con gusto te comparto más detalles.`,
  }

  const calido: MessageVariant = {
    angulo: 'Cálido/personalizado',
    texto: `${saludoBase} Soy parte del equipo de Plusval Inmobiliaria. Gracias por tu interés en ${propiedad} 🙌 Para orientarte mejor, ¿qué es lo que más buscas: cerca del trabajo, espacio para la familia, o inversión?`,
  }

  const urgencia: MessageVariant = {
    angulo: 'Urgencia/escasez',
    texto: `${saludoBase} Sobre ${propiedad} en ${ubicacion} (${precio}): tenemos varias personas preguntando esta semana, así que si sigue interesándote lo mejor es agendar una visita pronto. ¿Te viene bien hablar hoy o mañana?`,
  }

  return [directo, calido, urgencia]
}
