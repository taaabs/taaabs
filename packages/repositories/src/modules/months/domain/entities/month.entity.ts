export namespace MonthEntity {
  type Base = {
    tags: Record<string, number>
    bookmarkCount: number
    starredCount: number | null
    nsfwCount: number | null
  }

  export type Authorized = Base & {
    publicCount: number | null
  }
  export type Public = Base
}
