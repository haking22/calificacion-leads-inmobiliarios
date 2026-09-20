import './LeadsList.css'
import type { Lead } from '../lib/types'
import { CLASSIFICATION_BADGE_CLASS, leadSummary } from '../lib/scoring'
import { exportLeadsToXlsx } from '../lib/export'

interface Props {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
  onPlanFollowUp: (lead: Lead) => void
}

export default function LeadsList({ leads, onEdit, onDelete, onPlanFollowUp }: Props) {
  if (leads.length === 0) {
    return (
      <p className="empty-state">
        Todavía no hay leads calificados. Usa el formulario para agregar el primero.
      </p>
    )
  }

  return (
    <div>
      <div className="leads-toolbar">
        <button onClick={() => void exportLeadsToXlsx(leads)} className="button button--outline">
          Exportar a Excel
        </button>
      </div>
      <div className="leads-table-wrap">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Fuente</th>
              <th>Score</th>
              <th>Clasificación</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const { average, classification } = leadSummary(lead)
              return (
                <tr key={lead.id}>
                  <td className="leads-table__name">{lead.nombre}</td>
                  <td>{lead.fuente}</td>
                  <td className="leads-table__score">{average.toFixed(1)}</td>
                  <td>
                    <span className={CLASSIFICATION_BADGE_CLASS[classification]}>{classification}</span>
                  </td>
                  <td>{lead.fechaCreacion.slice(0, 10)}</td>
                  <td>
                    <div className="leads-table__actions">
                      <button
                        onClick={() => onPlanFollowUp(lead)}
                        className="leads-table__action leads-table__action--primary"
                      >
                        Seguimiento
                      </button>
                      <button
                        onClick={() => onEdit(lead)}
                        className="leads-table__action leads-table__action--neutral"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="leads-table__action leads-table__action--danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
