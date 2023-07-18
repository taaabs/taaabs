export namespace MonthEntity {
  type Base = {
    yymm: number
    tags: [string, number][]
    bookmarkCount: number
    starredCount: number | null
    nsfwCount: number | null
  }

  export type Authorized = Base & {
    publicCount: number | null
  }
  export type Public = Base
}
