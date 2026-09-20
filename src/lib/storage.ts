import type { FollowUpPlan, Lead } from './types'

const LEADS_KEY = 'plusval.leads.v1'
const PLANS_KEY = 'plusval.followup-plans.v1'

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function write<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items))
}

export function loadLeads(): Lead[] {
  return read<Lead>(LEADS_KEY)
}

export function saveLead(lead: Lead) {
  const leads = loadLeads()
  const idx = leads.findIndex((l) => l.id === lead.id)
  if (idx >= 0) leads[idx] = lead
  else leads.push(lead)
  write(LEADS_KEY, leads)
}

export function deleteLead(id: string) {
  write(LEADS_KEY, loadLeads().filter((l) => l.id !== id))
  write(PLANS_KEY, loadPlans().filter((p) => p.leadId !== id))
}

export function loadPlans(): FollowUpPlan[] {
  return read<FollowUpPlan>(PLANS_KEY)
}

export function savePlan(plan: FollowUpPlan) {
  const plans = loadPlans()
  const idx = plans.findIndex((p) => p.id === plan.id)
  if (idx >= 0) plans[idx] = plan
  else plans.push(plan)
  write(PLANS_KEY, plans)
}

export function planForLead(leadId: string): FollowUpPlan | undefined {
  return loadPlans().find((p) => p.leadId === leadId)
}

export function deletePlan(id: string) {
  write(PLANS_KEY, loadPlans().filter((p) => p.id !== id))
}
