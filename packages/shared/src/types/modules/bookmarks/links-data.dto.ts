export namespace LinksData_Dto {
  export namespace Response {
    export type Authorized = {
      url?: string
      url_aes?: string
      plain_text?: string
      plain_text_aes?: string
      reader_data?: string
      reader_data_aes?: string
    }[]
    export type Public = {
      url: string
      plain_text?: string
      reader_data?: string
    }[]
  }
}
