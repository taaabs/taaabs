export type UpsertBookmark_Params = {
  bookmark_id?: number
  is_public: boolean
  created_at?: Date
  title?: string
  note?: string
  is_archived: boolean
  is_unsorted: boolean
  stars?: number
  tags: { name: string; is_public?: boolean }[]
  links: {
    url: string
    site_path?: string
    is_public: boolean
    is_pinned?: boolean
    pin_title?: string
    open_snapshot?: boolean
    favicon?: string
    plain_text?: string
    reader_data?: string
  }[]
  cover?: string
}
