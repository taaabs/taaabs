export namespace GetBookmarks_Params {
  export type Authorized = {
    is_archived: boolean
  }
  export type Public = {
    is_archived: boolean
    username: string
  }
}
