export namespace LinksData_Dto {
  export namespace Response {
    export type Authorized = {
      url?: string
      url_aes?: string
      plain_text?: string
      plain_text_aes?: string
      content?: string
      content_aes?: string
    }[]
    export type Public = {
      url: string
      plain_text?: string
      content?: string
    }[]
  }
}
