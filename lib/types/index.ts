export type NiceStage = 'note' | 'investigate' | 'create' | 'execute'

export type NoteStatus = 'captured' | 'investigated' | 'planned' | 'executing' | 'done' | 'archived'

export type ItemType = 'task' | 'idea' | 'question' | 'reference' | 'problem'

export type Category = 'money_move' | 'outreach' | 'build' | 'admin' | 'boredom' | 'someday'

export type Priority = 'critical' | 'high' | 'medium' | 'low'

export type EnergyLevel = 'high' | 'medium' | 'low'

export type ExecutionStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'snoozed'

export interface NoteWithInvestigation {
  id: string
  rawInput: string
  inputType: string
  createdAt: Date
  status: NoteStatus
  currentStage: NiceStage
  investigation?: InvestigationData | null
}

export interface InvestigationData {
  id: string
  aiInterpretation: string
  itemType: ItemType
  category: Category
  priority: Priority
  complexity: string
  energyRequired: EnergyLevel
  timeEstimateMinutes: number
  needsBreakdown: boolean
}

export interface DailyPlanData {
  date: string
  moneyMove?: PlanWithDetails
  top3: PlanWithDetails[]
  boredomTasks: PlanWithDetails[]
  totalTimeMinutes: number
}

export interface PlanWithDetails {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  energyRequired: EnergyLevel
  timeEstimateMinutes: number
  scheduledDate?: Date
  scheduledTime?: string
  breakdownSteps?: string[]
  contextNotes?: string
  execution?: ExecutionData
}

export interface ExecutionData {
  id: string
  status: ExecutionStatus
  startedAt?: Date
  completedAt?: Date
  timeSpentMinutes: number
  blockerDescription?: string
  outcomeNotes?: string
  energyLevelActual?: EnergyLevel
}
