export namespace CheckUrlSaved_Dto {
  export type Response = {
    is_saved: boolean
  }
  export type Body = {
    url_hash: string
  }
}
