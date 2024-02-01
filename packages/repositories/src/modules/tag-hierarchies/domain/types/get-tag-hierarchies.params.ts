export namespace GetTagHierarchies_Params {
  type Base = {
    starred_only?: boolean
    is_archived?: boolean
    gte?: number
    lte?: number
  }
  export type Authorized = {
    unread_only?: boolean
  } & Base
  export type Public = {
    username: string
  } & Base
}
