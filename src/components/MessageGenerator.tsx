import { useState } from 'react'
import './MessageGenerator.css'
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
    <div className="message-generator">
      <div className="message-generator__grid">
        <label className="field">
          Nombre del lead (opcional)
          <input
            className="field__input"
            value={input.nombreLead}
            onChange={(e) => update('nombreLead', e.target.value)}
            placeholder="Ej. María"
          />
        </label>
        <label className="field">
          Anuncio / campaña
          <input
            className="field__input"
            value={input.anuncio}
            onChange={(e) => update('anuncio', e.target.value)}
            placeholder="Ej. Apartamentos Piantini Sept."
          />
        </label>
        <label className="field">
          Propiedad / tipo
          <input
            className="field__input"
            value={input.propiedad}
            onChange={(e) => update('propiedad', e.target.value)}
            placeholder="Ej. apartamento de 2 habitaciones"
          />
        </label>
        <label className="field">
          Ubicación
          <input
            className="field__input"
            value={input.ubicacion}
            onChange={(e) => update('ubicacion', e.target.value)}
            placeholder="Ej. Piantini, Santo Domingo"
          />
        </label>
        <label className="field">
          Precio
          <input
            className="field__input"
            value={input.precio}
            onChange={(e) => update('precio', e.target.value)}
            placeholder="Ej. US$180,000"
          />
        </label>
        <label className="field">
          Tono
          <select className="field__select" value={input.tono} onChange={(e) => update('tono', e.target.value as Tono)}>
            <option value="cercano">Cercano y profesional</option>
            <option value="formal">Formal</option>
            <option value="urgencia">Urgencia</option>
          </select>
        </label>
      </div>

      <div className="variants-grid">
        {variants.map((variant, index) => (
          <div key={variant.angulo} className="variant-card">
            <p className="variant-card__label">{variant.angulo}</p>
            <p className="variant-card__text">{variant.texto}</p>
            <button onClick={() => copy(variant.texto, index)} className="button button--outline variant-card__copy">
              {copiedIndex === index ? 'Copiado ✓' : 'Copiar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
