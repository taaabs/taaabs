import { MonthEntity } from '../entities/month.entity'

export namespace MonthsRo {
  type Base = {
    isMonthsUpdateScheduled: boolean
  }
  export type Authorized = Base & {
    monthsOfBookmarkCreation: MonthEntity.Authorized[]
    monthsOfUrlCreation: MonthEntity.Authorized[]
  }
  export type Public = Base & {
    monthsOfBookmarkCreation: MonthEntity.Public[]
    monthsOfUrlCreation: MonthEntity.Public[]
  }
}
