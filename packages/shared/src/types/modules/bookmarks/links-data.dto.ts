export namespace LinksData_Dto {
  export namespace Response {
    export type Authorized = {
      url?: string
      url_aes?: string
      parsed_plain_text?: string
      parsed_plain_text_aes?: string
      parsed_reader_data?: string
      parsed_reader_data_aes?: string
    }[]
    export type Public = {
      url: string
      parsed_plain_text?: string
      parsed_reader_data?: string
    }[]
  }
}
