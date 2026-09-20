import { useEffect, useState } from 'react'
import LeadForm from './components/LeadForm'
import LeadsList from './components/LeadsList'
import MessageGenerator from './components/MessageGenerator'
import FollowUpPlanView from './components/FollowUpPlan'
import type { FollowUpPlan, Lead } from './lib/types'
import { deleteLead, loadLeads, loadPlans, planForLead, saveLead, savePlan } from './lib/storage'

type Tab = 'leads' | 'mensajes' | 'seguimiento'
type LeadsView = { mode: 'list' } | { mode: 'form'; lead?: Lead } | { mode: 'plan'; lead: Lead }

const TABS: { key: Tab; label: string }[] = [
  { key: 'leads', label: 'Calificar leads' },
  { key: 'mensajes', label: 'Mensajes de apertura' },
  { key: 'seguimiento', label: 'Plan de seguimiento' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [plans, setPlans] = useState<FollowUpPlan[]>([])
  const [leadsView, setLeadsView] = useState<LeadsView>({ mode: 'list' })

  useEffect(() => {
    setLeads(loadLeads())
    setPlans(loadPlans())
  }, [])

  function handleSaveLead(lead: Lead) {
    saveLead(lead)
    setLeads(loadLeads())
    setLeadsView({ mode: 'list' })
  }

  function handleDeleteLead(id: string) {
    if (!confirm('¿Eliminar este lead y su plan de seguimiento?')) return
    deleteLead(id)
    setLeads(loadLeads())
    setPlans(loadPlans())
  }

  function handleSavePlan(plan: FollowUpPlan) {
    savePlan(plan)
    setPlans(loadPlans())
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-teal text-white">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <h1 className="text-xl font-bold">Calificación de leads inmobiliarios</h1>
          <p className="text-sm text-neutral-100/90">Plusval Inmobiliaria — scoring, mensajes y seguimiento</p>
        </div>
      </header>

      <nav className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl gap-1 px-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === t.key ? 'border-teal text-teal' : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === 'leads' && (
          <section className="space-y-6">
            {leadsView.mode === 'list' && (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={() => setLeadsView({ mode: 'form' })}
                    className="rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    + Calificar nuevo lead
                  </button>
                </div>
                <LeadsList
                  leads={leads}
                  onEdit={(lead) => setLeadsView({ mode: 'form', lead })}
                  onDelete={handleDeleteLead}
                  onPlanFollowUp={(lead) => setLeadsView({ mode: 'plan', lead })}
                />
              </>
            )}
            {leadsView.mode === 'form' && (
              <LeadForm
                initialLead={leadsView.lead}
                onSave={handleSaveLead}
                onCancel={() => setLeadsView({ mode: 'list' })}
              />
            )}
            {leadsView.mode === 'plan' && (
              <FollowUpPlanView
                lead={leadsView.lead}
                existingPlan={planForLead(leadsView.lead.id)}
                onSave={handleSavePlan}
                onClose={() => setLeadsView({ mode: 'list' })}
              />
            )}
          </section>
        )}

        {tab === 'mensajes' && <MessageGenerator />}

        {tab === 'seguimiento' && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">Planes de seguimiento guardados</h2>
            {plans.length === 0 && (
              <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
                No hay planes guardados todavía. Ve a "Calificar leads" y usa el botón "Seguimiento" en un lead.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((plan) => {
                const done = plan.touches.filter((t) => t.done).length
                return (
                  <div key={plan.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                    <p className="font-medium text-neutral-800">{plan.leadNombre}</p>
                    <p className="text-sm text-neutral-500">
                      {plan.startDate} · {plan.hora} · {done}/{plan.touches.length} toques hechos
                    </p>
                    <button
                      onClick={() => {
                        const lead = leads.find((l) => l.id === plan.leadId)
                        if (lead) {
                          setTab('leads')
                          setLeadsView({ mode: 'plan', lead })
                        }
                      }}
                      className="mt-2 text-sm font-medium text-teal hover:underline"
                    >
                      Ver / editar
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
