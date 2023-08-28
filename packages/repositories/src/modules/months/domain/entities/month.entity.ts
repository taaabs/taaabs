export namespace MonthEntity {
  type Base = {
    tags: Record<string, { id: number; yields: number }>
    bookmarkCount: number
    starredCount: number | null
    nsfwCount: number | null
  }

  export type Authorized = Base & {
    publicCount: number | null
  }
  export type Public = Base
}
