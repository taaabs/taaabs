import { Month_Entity } from '../entities/month.entity'

export namespace Months_Ro {
  type Base = {
    is_months_update_scheduled: boolean
  }
  export type Authorized = Base & {
    created_at: Record<string, Month_Entity.Authorized>
    updated_at: Record<string, Month_Entity.Authorized>
  }
  export type Public = Base & {
    created_at: Record<string, Month_Entity.Public>
    updated_at: Record<string, Month_Entity.Public>
  }
}
