import { useState } from 'react'
import type { FollowUpPlan as FollowUpPlanType, Lead, Touch } from '../lib/types'
import { generatePlan } from '../lib/followup'
import { leadSummary } from '../lib/scoring'

interface Props {
  lead: Lead
  existingPlan?: FollowUpPlanType
  onSave: (plan: FollowUpPlanType) => void
  onClose: () => void
}

export default function FollowUpPlan({ lead, existingPlan, onSave, onClose }: Props) {
  const [startDate, setStartDate] = useState(existingPlan?.startDate ?? new Date().toISOString().slice(0, 10))
  const [hora, setHora] = useState(existingPlan?.hora ?? '09:00')
  const [plan, setPlan] = useState<FollowUpPlanType | null>(existingPlan ?? null)
  const { classification } = leadSummary(lead)

  function handleGenerate() {
    const newPlan = generatePlan(lead.id, lead.nombre, new Date(`${startDate}T00:00:00`), hora)
    setPlan(newPlan)
  }

  function updateTouch(id: string, patch: Partial<Touch>) {
    if (!plan) return
    setPlan({
      ...plan,
      touches: plan.touches.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })
  }

  function handleSave() {
    if (plan) onSave(plan)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">Plan de seguimiento — {lead.nombre}</h2>
          <p className="text-sm text-neutral-500">Clasificación actual: {classification}</p>
        </div>
        <button onClick={onClose} className="text-sm font-medium text-neutral-500 hover:underline">
          Volver a la lista
        </button>
      </div>

      {classification === 'Frío/Perdido' && (
        <p className="rounded-lg border border-gold/40 bg-gold/10 p-3 text-sm text-neutral-700">
          Este lead está clasificado como Frío/Perdido por retiro explícito. Los 32 toques igual son válidos, pero
          considera un tono de reactivación suave y espaciado. Puedes ajustar la cadencia o pausarla si lo prefieres.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Fecha de inicio
          <input
            type="date"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Hora del toque
          <input
            type="time"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-teal focus:outline-none"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </label>
        <div className="flex items-end">
          <button onClick={handleGenerate} className="w-full rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            {plan ? 'Regenerar 32 toques' : 'Generar 32 toques'}
          </button>
        </div>
      </div>

      {plan && (
        <>
          <p className="text-sm text-neutral-600">
            {plan.touches.length} toques, del {plan.touches[0].date} al {plan.touches[plan.touches.length - 1].date}, a las {plan.hora}, cada ~11 días.
          </p>
          <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-3 py-2 w-10">#</th>
                  <th className="px-3 py-2 w-28">Fecha</th>
                  <th className="px-3 py-2">Título</th>
                  <th className="px-3 py-2">Nota</th>
                  <th className="px-3 py-2 w-16">Hecho</th>
                </tr>
              </thead>
              <tbody>
                {plan.touches.map((touch) => (
                  <tr key={touch.id} className="border-t border-neutral-100">
                    <td className="px-3 py-1 text-neutral-500">{touch.index}</td>
                    <td className="px-3 py-1 text-neutral-600">{touch.date}</td>
                    <td className="px-3 py-1">
                      <input
                        className="w-full rounded border border-transparent px-1 py-0.5 text-sm hover:border-neutral-200 focus:border-teal focus:outline-none"
                        value={touch.title}
                        onChange={(e) => updateTouch(touch.id, { title: e.target.value })}
                      />
                    </td>
                    <td className="px-3 py-1">
                      <input
                        className="w-full rounded border border-transparent px-1 py-0.5 text-sm hover:border-neutral-200 focus:border-teal focus:outline-none"
                        placeholder="Ej. revisar si ya se precalificó"
                        value={touch.note}
                        onChange={(e) => updateTouch(touch.id, { note: e.target.value })}
                      />
                    </td>
                    <td className="px-3 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={touch.done}
                        onChange={(e) => updateTouch(touch.id, { done: e.target.checked })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleSave} className="rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Guardar plan
          </button>
        </>
      )}
    </div>
  )
}
