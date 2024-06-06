export namespace GetBookmarks_Params {
  export type Authorized = {
    is_archived: boolean
    include_visited_at?: boolean
    include_points?: boolean
    after?: number
  }
  export type Public = {
    username: string
    is_archived: boolean
    include_points?: boolean
    after?: number
  }
}
