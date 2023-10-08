import { Month_Entity } from '../entities/month.entity'

export type Months_Ro = {
  created_at?: Record<string, Month_Entity>
  updated_at?: Month_Entity
  is_months_update_scheduled?: boolean
}
