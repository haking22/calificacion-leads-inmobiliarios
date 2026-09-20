import { useState } from 'react'
import { PARAM_DEFS, type Lead } from '../lib/types'
import { classify, computeAverage, newLead } from '../lib/scoring'

interface Props {
  initialLead?: Lead
  onSave: (lead: Lead) => void
  onCancel?: () => void
}

export default function LeadForm({ initialLead, onSave, onCancel }: Props) {
  const [lead, setLead] = useState<Lead>(initialLead ?? newLead('', 'WhatsApp'))

  const average = computeAverage(lead.scores)
  const classification = classify(average, lead.retiroExplicito)

  function updateParam(key: (typeof PARAM_DEFS)[number]['key'], patch: Partial<Lead['scores'][typeof key]>) {
    setLead((prev) => ({
      ...prev,
      scores: { ...prev.scores, [key]: { ...prev.scores[key], ...patch } },
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!lead.nombre.trim()) return
    onSave(lead)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Nombre del lead
          <input
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={lead.nombre}
            onChange={(e) => setLead((prev) => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej. José Quezada"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Fuente
          <select
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={lead.fuente}
            onChange={(e) => setLead((prev) => ({ ...prev, fuente: e.target.value }))}
          >
            <option value="WhatsApp">WhatsApp</option>
            <option value="Facebook Ads">Facebook Ads</option>
            <option value="Referido">Referido</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
      </div>

      <div className="space-y-4">
        {PARAM_DEFS.map((def) => {
          const paramScore = lead.scores[def.key]
          return (
            <div key={def.key} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-neutral-800">{def.label}</p>
                  <p className="text-sm text-neutral-500">{def.question}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={paramScore.score}
                    disabled={paramScore.sinDatos}
                    onChange={(e) => updateParam(def.key, { score: Number(e.target.value) })}
                    className="accent-teal"
                  />
                  <span className="w-6 text-center font-semibold text-teal">{paramScore.score}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-neutral-500">
                  <input
                    type="checkbox"
                    checked={paramScore.sinDatos}
                    onChange={(e) =>
                      updateParam(def.key, {
                        sinDatos: e.target.checked,
                        score: e.target.checked ? 3 : paramScore.score,
                      })
                    }
                  />
                  Sin datos (usar valor conservador)
                </label>
              </div>
              <textarea
                className="mt-2 w-full rounded-md border border-neutral-200 px-2 py-1 text-sm focus:border-teal focus:outline-none"
                placeholder="Evidencia textual de la conversación que justifica el score..."
                rows={2}
                value={paramScore.nota}
                onChange={(e) => updateParam(def.key, { nota: e.target.value })}
              />
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border border-coral/40 bg-coral/5 p-4">
        <label className="flex items-start gap-2 text-sm font-medium text-neutral-800">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={lead.retiroExplicito}
            onChange={(e) => setLead((prev) => ({ ...prev, retiroExplicito: e.target.checked }))}
          />
          El lead expresó explícitamente que se retira / ya no le interesa (anula el score numérico)
        </label>
        {lead.retiroExplicito && (
          <textarea
            className="mt-2 w-full rounded-md border border-neutral-200 px-2 py-1 text-sm focus:border-teal focus:outline-none"
            placeholder="¿Qué razón dio (o no dio) el lead? Útil para un posible seguimiento futuro."
            rows={2}
            value={lead.notasRetiro}
            onChange={(e) => setLead((prev) => ({ ...prev, notasRetiro: e.target.value }))}
          />
        )}
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
        Notas generales / análisis psicológico
        <textarea
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          rows={3}
          placeholder="Estilo de comunicación, patrón de negociación, tolerancia al riesgo, interpretación de silencios..."
          value={lead.notasGenerales}
          onChange={(e) => setLead((prev) => ({ ...prev, notasGenerales: e.target.value }))}
        />
      </label>

      <div className="flex items-center justify-between rounded-lg bg-teal/10 p-4">
        <div>
          <p className="text-sm text-neutral-600">Score total (promedio de 9 parámetros)</p>
          <p className="text-2xl font-bold text-teal">{average.toFixed(1)} / 10</p>
        </div>
        <span className="rounded-full border px-4 py-1 text-sm font-semibold text-neutral-800">{classification}</span>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Guardar lead
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
