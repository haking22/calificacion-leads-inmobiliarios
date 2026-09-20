import { PARAM_DEFS } from './types'
import type { Lead } from './types'
import { leadSummary } from './scoring'

export async function exportLeadsToXlsx(leads: Lead[]) {
  const XLSX = await import('xlsx')
  const rows = leads.map((lead) => {
    const { average, classification } = leadSummary(lead)
    const row: Record<string, string | number> = {
      Nombre: lead.nombre,
      Fuente: lead.fuente,
      Fecha: lead.fechaCreacion.slice(0, 10),
    }
    for (const def of PARAM_DEFS) {
      row[def.label] = lead.scores[def.key].score
    }
    row['Score total'] = Number(average.toFixed(2))
    row['Clasificación'] = classification
    row['Retiro explícito'] = lead.retiroExplicito ? 'Sí' : 'No'
    row['Notas retiro'] = lead.notasRetiro
    row['Notas generales'] = lead.notasGenerales
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')
  const fecha = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `leads-plusval-${fecha}.xlsx`)
}
