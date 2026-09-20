import type { Lead } from '../lib/types'
import { CLASSIFICATION_COLORS, leadSummary } from '../lib/scoring'
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
      <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
        Todavía no hay leads calificados. Usa el formulario para agregar el primero.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => void exportLeadsToXlsx(leads)}
          className="rounded-md border border-teal px-3 py-1.5 text-sm font-medium text-teal hover:bg-teal/10"
        >
          Exportar a Excel
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2">Lead</th>
              <th className="px-4 py-2">Fuente</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Clasificación</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const { average, classification } = leadSummary(lead)
              return (
                <tr key={lead.id} className="border-t border-neutral-100">
                  <td className="px-4 py-2 font-medium text-neutral-800">{lead.nombre}</td>
                  <td className="px-4 py-2 text-neutral-600">{lead.fuente}</td>
                  <td className="px-4 py-2 font-semibold text-teal">{average.toFixed(1)}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${CLASSIFICATION_COLORS[classification]}`}>
                      {classification}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-neutral-500">{lead.fechaCreacion.slice(0, 10)}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onPlanFollowUp(lead)} className="text-xs font-medium text-teal hover:underline">
                        Seguimiento
                      </button>
                      <button onClick={() => onEdit(lead)} className="text-xs font-medium text-neutral-600 hover:underline">
                        Editar
                      </button>
                      <button onClick={() => onDelete(lead.id)} className="text-xs font-medium text-coral hover:underline">
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
