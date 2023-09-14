import { MonthEntity } from '../entities/month.entity'

export namespace MonthsRo {
  type Base = {
    is_months_update_scheduled: boolean
  }
  export type Authorized = Base & {
    created_at: Record<string, MonthEntity.Authorized>
    updated_at: Record<string, MonthEntity.Authorized>
  }
  export type Public = Base & {
    created_at: Record<string, MonthEntity.Public>
    updated_at: Record<string, MonthEntity.Public>
  }
}
