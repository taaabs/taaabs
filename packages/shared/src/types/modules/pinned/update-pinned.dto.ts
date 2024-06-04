import { Pinned_Dto } from './pinned.dto'

export namespace UpdatePinned_Dto {
  export type Item = {
    hash: string
    title?: string
    title_aes?: string
  }
  export type Body = Item[]
  export type Response = Pinned_Dto.Response
}
