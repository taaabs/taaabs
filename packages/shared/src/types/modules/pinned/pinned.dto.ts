export namespace Pinned_Dto {
  type Item = {
    bookmark_id: number
    url?: string
    url_aes?: string
    title?: string
    title_aes?: string
    stars?: number
    is_unread?: boolean
    tags?: number[]
  }
  export type Response = Item[]
  export type SearchParams = {
    is_archived?: 1 | 0
  }
}
