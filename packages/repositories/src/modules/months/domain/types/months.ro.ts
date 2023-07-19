import { MonthEntity } from '../entities/month.entity'

export namespace MonthsRo {
  type Base = {
    isMonthsUpdateScheduled: boolean
  }
  export type Authorized = Base & {
    monthsOfBookmarkCreation: Record<number, MonthEntity.Authorized>
    monthsOfUrlCreation: Record<number, MonthEntity.Authorized>
  }
  export type Public = Base & {
    monthsOfBookmarkCreation: Record<number, MonthEntity.Public>
    monthsOfUrlCreation: Record<number, MonthEntity.Public>
  }
}
