export namespace GetLinksData_Params {
  type Base = {
    bookmark_id: number
    bookmark_updated_at?: string
  }
  export type Authorized = Base
  export type Public = Base & {
    username: string
  }
}
