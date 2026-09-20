import { useState } from 'react'
import './LeadForm.css'
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
    <form onSubmit={handleSubmit} className="lead-form">
      <div className="lead-form__grid">
        <label className="field">
          Nombre del lead
          <input
            required
            className="field__input"
            value={lead.nombre}
            onChange={(e) => setLead((prev) => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej. José Quezada"
          />
        </label>
        <label className="field">
          Fuente
          <select
            className="field__select"
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

      <div className="param-list">
        {PARAM_DEFS.map((def) => {
          const paramScore = lead.scores[def.key]
          return (
            <div key={def.key} className="param-card">
              <div className="param-card__head">
                <div>
                  <p className="param-card__label">{def.label}</p>
                  <p className="param-card__question">{def.question}</p>
                </div>
                <div className="param-card__score">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={paramScore.score}
                    disabled={paramScore.sinDatos}
                    onChange={(e) => updateParam(def.key, { score: Number(e.target.value) })}
                    className="param-card__slider"
                  />
                  <span className="param-card__score-value">{paramScore.score}</span>
                </div>
              </div>
              <div className="param-card__options">
                <label className="param-card__checkbox">
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
                className="field__textarea param-card__note"
                placeholder="Evidencia textual de la conversación que justifica el score..."
                rows={2}
                value={paramScore.nota}
                onChange={(e) => updateParam(def.key, { nota: e.target.value })}
              />
            </div>
          )
        })}
      </div>

      <div className="withdrawal-panel">
        <label className="withdrawal-panel__checkbox">
          <input
            type="checkbox"
            checked={lead.retiroExplicito}
            onChange={(e) => setLead((prev) => ({ ...prev, retiroExplicito: e.target.checked }))}
          />
          El lead expresó explícitamente que se retira / ya no le interesa (anula el score numérico)
        </label>
        {lead.retiroExplicito && (
          <textarea
            className="field__textarea withdrawal-panel__note"
            placeholder="¿Qué razón dio (o no dio) el lead? Útil para un posible seguimiento futuro."
            rows={2}
            value={lead.notasRetiro}
            onChange={(e) => setLead((prev) => ({ ...prev, notasRetiro: e.target.value }))}
          />
        )}
      </div>

      <label className="field">
        Notas generales / análisis psicológico
        <textarea
          className="field__textarea"
          rows={3}
          placeholder="Estilo de comunicación, patrón de negociación, tolerancia al riesgo, interpretación de silencios..."
          value={lead.notasGenerales}
          onChange={(e) => setLead((prev) => ({ ...prev, notasGenerales: e.target.value }))}
        />
      </label>

      <div className="summary-bar">
        <div>
          <p className="summary-bar__label">Score total (promedio de 9 parámetros)</p>
          <p className="summary-bar__score">{average.toFixed(1)} / 10</p>
        </div>
        <span className="summary-bar__badge">{classification}</span>
      </div>

      <div className="lead-form__actions">
        <button type="submit" className="button button--primary">
          Guardar lead
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="button button--ghost">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
