export namespace UpdatePinned_Dto {
  type Item = {
    hash: string
    title?: string
    title_aes?: string
  }
  export type Body = Item[]
}
