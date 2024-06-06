export namespace GetBookmarks_Params {
  export type Authorized = {
    is_archived: boolean
    after?: number
  }
  export type Public = {
    is_archived: boolean
    after?: number
    username: string
  }
}
