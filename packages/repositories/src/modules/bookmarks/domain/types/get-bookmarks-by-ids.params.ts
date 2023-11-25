export namespace GetBookmarksByIds_Params {
  type Base = {
    ids: number[]
  }
  export type Authorized = Base
  export type Public = Base & {
    username: string
  }
}
