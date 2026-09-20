import { useState } from 'react'
import { generateMessages, type MessageInput, type Tono } from '../lib/messages'

const initialInput: MessageInput = {
  nombreLead: '',
  anuncio: '',
  propiedad: '',
  ubicacion: '',
  precio: '',
  tono: 'cercano',
}

export default function MessageGenerator() {
  const [input, setInput] = useState<MessageInput>(initialInput)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const variants = generateMessages(input)

  function update<K extends keyof MessageInput>(key: K, value: MessageInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  async function copy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch {
      // clipboard no disponible; el usuario puede seleccionar el texto manualmente
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Nombre del lead (opcional)
          <input
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={input.nombreLead}
            onChange={(e) => update('nombreLead', e.target.value)}
            placeholder="Ej. María"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Anuncio / campaña
          <input
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={input.anuncio}
            onChange={(e) => update('anuncio', e.target.value)}
            placeholder="Ej. Apartamentos Piantini Sept."
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Propiedad / tipo
          <input
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={input.propiedad}
            onChange={(e) => update('propiedad', e.target.value)}
            placeholder="Ej. apartamento de 2 habitaciones"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Ubicación
          <input
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={input.ubicacion}
            onChange={(e) => update('ubicacion', e.target.value)}
            placeholder="Ej. Piantini, Santo Domingo"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Precio
          <input
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={input.precio}
            onChange={(e) => update('precio', e.target.value)}
            placeholder="Ej. US$180,000"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Tono
          <select
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={input.tono}
            onChange={(e) => update('tono', e.target.value as Tono)}
          >
            <option value="cercano">Cercano y profesional</option>
            <option value="formal">Formal</option>
            <option value="urgencia">Urgencia</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {variants.map((variant, index) => (
          <div key={variant.angulo} className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">{variant.angulo}</p>
            <p className="flex-1 whitespace-pre-wrap text-sm text-neutral-800">{variant.texto}</p>
            <button
              onClick={() => copy(variant.texto, index)}
              className="mt-3 self-start rounded-md border border-teal px-3 py-1 text-xs font-medium text-teal hover:bg-teal/10"
            >
              {copiedIndex === index ? 'Copiado ✓' : 'Copiar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
