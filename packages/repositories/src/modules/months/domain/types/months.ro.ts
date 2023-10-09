import { Month_Entity } from '../entities/month.entity'

export type Months_Ro = {
  months?: Record<string, Month_Entity>
  is_months_update_scheduled?: boolean
}
