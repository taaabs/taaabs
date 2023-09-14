export namespace MonthEntity {
  type Base = {
    tags: Record<string, { id: number; yields: number }>
    bookmark_count: number
    starred_count: number | null
    nsfw_count: number | null
  }

  export type Authorized = Base & {
    public_count: number | null
  }
  export type Public = Base
}
