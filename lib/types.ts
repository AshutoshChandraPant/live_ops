export type UserRole = 'pm' | 'ops' | 'leadership'

export type SessionStatus =
  | 'Draft'
  | 'Awaiting Final Confirmation'
  | 'Confirmed'
  | 'Cancelled'

export type Published = 'Yes' | 'No'

export type DeckStatus =
  | 'Not Started'
  | 'Pending'
  | 'In Progress'
  | 'Ready'
  | 'Shared'

export type InstructorConnect = 'Pending' | 'Scheduled' | 'Completed'

export interface TeamMember {
  id: string
  name: string
  role: UserRole
  availability: string | null
  weekly_capacity: number
  created_at: string
}

export interface SessionType {
  id: string
  name: string
  active: boolean
  created_at: string
}

export interface OpsAssignee {
  id: string
  name: string
}

export interface Session {
  id: string
  program: string
  cohort: string
  session_type: string
  date: string
  start_time: string
  end_time: string
  instructor: string | null
  meeting_link: string | null
  notes: string | null
  soft_confirmed: boolean
  final_confirmed: boolean
  cancelled: boolean
  ops_in_charge: string | null
  published: Published
  deck_status: DeckStatus
  instructor_connect: InstructorConnect
  created_by: string | null
  created_at: string
  updated_at: string
  // From view
  session_status?: SessionStatus
  ops_in_charge_name?: string | null
  day_of_week?: string
  additional_ops?: OpsAssignee[]
}

export interface SessionInsert {
  program: string
  cohort: string
  session_type: string
  date: string
  start_time: string
  end_time: string
  instructor?: string
  meeting_link?: string
  notes?: string
}

export interface SessionUpdate {
  program?: string
  cohort?: string
  session_type?: string
  date?: string
  start_time?: string
  end_time?: string
  instructor?: string | null
  meeting_link?: string | null
  notes?: string | null
  soft_confirmed?: boolean
  final_confirmed?: boolean
  cancelled?: boolean
  ops_in_charge?: string | null
  published?: Published
  deck_status?: DeckStatus
  instructor_connect?: InstructorConnect
}

export interface Notification {
  id: string
  sessionId: string
  type:
    | 'missing_instructor'
    | 'missing_moderator'
    | 'pending_confirmation'
    | 'deck_pending'
    | 'starting_soon'
  message: string
  date: string
}
