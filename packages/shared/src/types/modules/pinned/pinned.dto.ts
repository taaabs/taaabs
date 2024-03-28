export namespace Pinned_Dto {
  type Item = {
    bookmark_id: number
    created_at: number
    is_link_public?: boolean // Used for updates - while updating order/title we need to know if data should be encrypted.
    url?: string
    url_aes?: string
    title?: string
    title_aes?: string
    stars?: number
    is_unread?: boolean
    tags?: number[]
  }
  export type Response = Item[]
}
