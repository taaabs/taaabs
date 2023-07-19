import { MonthEntity } from '../entities/month.entity'

export namespace MonthsRo {
  type Base = {
    isMonthsUpdateScheduled: boolean
  }
  export type Authorized = Base & {
    monthsOfBookmarkCreation: Record<string, MonthEntity.Authorized>
    monthsOfUrlCreation: Record<string, MonthEntity.Authorized>
  }
  export type Public = Base & {
    monthsOfBookmarkCreation: Record<string, MonthEntity.Public>
    monthsOfUrlCreation: Record<string, MonthEntity.Public>
  }
}
