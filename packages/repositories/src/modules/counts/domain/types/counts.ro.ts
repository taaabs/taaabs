import { Month_Entity } from '../entities/month.entity'

export type Counts_Ro = {
  months?: Record<string, Month_Entity>
  is_counts_update_scheduled?: boolean
}
