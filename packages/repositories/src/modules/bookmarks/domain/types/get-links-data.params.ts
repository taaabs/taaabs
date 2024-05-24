export namespace GetLinksData_Params {
  type Base = {
    bookmark_id: number
  }
  export type Authorized = Base
  export type Public = Base & {
    username: string
  }
}
