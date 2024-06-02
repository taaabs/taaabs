export namespace LinksData_Dto {
  export namespace Response {
    export type Authorized = {
      url?: string
      url_aes?: string
      reader_data?: string
      reader_data_aes?: string
    }[]
    export type Public = {
      url: string
      reader_data?: string
    }[]
  }
}
