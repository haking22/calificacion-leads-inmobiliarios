import { useEffect, useState } from 'react'
import './App.css'
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

  function openPlanFromCard(leadId: string) {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return
    setTab('leads')
    setLeadsView({ mode: 'plan', lead })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-header__title">Calificación de leads inmobiliarios</h1>
          <p className="app-header__subtitle">Plusval Inmobiliaria — scoring, mensajes y seguimiento</p>
        </div>
      </header>

      <nav className="app-nav">
        <div className="app-nav__inner">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`app-nav__tab${tab === t.key ? ' app-nav__tab--active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="app-main">
        {tab === 'leads' && (
          <section>
            {leadsView.mode === 'list' && (
              <>
                <div className="section-header section-header--end">
                  <button onClick={() => setLeadsView({ mode: 'form' })} className="button button--primary">
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
          <section>
            <div className="section-header">
              <h2 className="section-title">Planes de seguimiento guardados</h2>
            </div>
            {plans.length === 0 && (
              <p className="empty-state">
                No hay planes guardados todavía. Ve a "Calificar leads" y usa el botón "Seguimiento" en un lead.
              </p>
            )}
            <div className="plans-grid">
              {plans.map((plan) => {
                const done = plan.touches.filter((t) => t.done).length
                return (
                  <div key={plan.id} className="plan-card">
                    <p className="plan-card__name">{plan.leadNombre}</p>
                    <p className="plan-card__meta">
                      {plan.startDate} · {plan.hora} · {done}/{plan.touches.length} toques hechos
                    </p>
                    <button onClick={() => openPlanFromCard(plan.leadId)} className="plan-card__link">
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
