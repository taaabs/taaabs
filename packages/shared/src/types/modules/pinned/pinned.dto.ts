export namespace Pinned_Dto {
  type Item = {
    bookmark_id: number
    created_at: string
    updated_at: string
    is_public?: boolean // Used for updates - while updating order/title we need to know if data should be encrypted
    url?: string
    url_aes?: string
    title?: string
    title_aes?: string
    stars?: number
    is_unsorted?: boolean
    is_archived?: boolean
    tags?: number[]
    open_snapshot?: boolean
  }
  export type Response = Item[]
}
