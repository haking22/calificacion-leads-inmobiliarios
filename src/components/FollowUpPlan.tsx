import { useState } from 'react'
import './FollowUpPlan.css'
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
    <div className="followup">
      <div className="followup__head">
        <div>
          <h2 className="followup__title">Plan de seguimiento — {lead.nombre}</h2>
          <p className="followup__subtitle">Clasificación actual: {classification}</p>
        </div>
        <button onClick={onClose} className="followup__back">
          Volver a la lista
        </button>
      </div>

      {classification === 'Frío/Perdido' && (
        <p className="followup__notice">
          Este lead está clasificado como Frío/Perdido por retiro explícito. Los 32 toques igual son válidos, pero
          considera un tono de reactivación suave y espaciado. Puedes ajustar la cadencia o pausarla si lo prefieres.
        </p>
      )}

      <div className="followup__controls">
        <label className="field">
          Fecha de inicio
          <input
            type="date"
            className="field__input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="field">
          Hora del toque
          <input type="time" className="field__input" value={hora} onChange={(e) => setHora(e.target.value)} />
        </label>
        <div className="followup__controls-action">
          <button onClick={handleGenerate} className="button button--primary">
            {plan ? 'Regenerar 32 toques' : 'Generar 32 toques'}
          </button>
        </div>
      </div>

      {plan && (
        <>
          <p className="followup__summary">
            {plan.touches.length} toques, del {plan.touches[0].date} al {plan.touches[plan.touches.length - 1].date},
            a las {plan.hora}, cada ~11 días.
          </p>
          <div className="touches-table-wrap">
            <table className="touches-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Título</th>
                  <th>Nota</th>
                  <th>Hecho</th>
                </tr>
              </thead>
              <tbody>
                {plan.touches.map((touch) => (
                  <tr key={touch.id}>
                    <td className="touches-table__index">{touch.index}</td>
                    <td className="touches-table__date">{touch.date}</td>
                    <td>
                      <input
                        className="touches-table__input"
                        value={touch.title}
                        onChange={(e) => updateTouch(touch.id, { title: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="touches-table__input"
                        placeholder="Ej. revisar si ya se precalificó"
                        value={touch.note}
                        onChange={(e) => updateTouch(touch.id, { note: e.target.value })}
                      />
                    </td>
                    <td className="touches-table__done">
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
          <button onClick={handleSave} className="button button--primary">
            Guardar plan
          </button>
        </>
      )}
    </div>
  )
}
