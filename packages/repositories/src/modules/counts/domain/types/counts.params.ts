export namespace Counts_Params {
  type Base = {
    starred_only?: boolean
    is_archived?: boolean
    tags?: string[]
  }
  export type Authorized = Base & {
    unread_only?: boolean
    public_only?: boolean
  }
  export type Public = Base & {
    username: string
  }
}
