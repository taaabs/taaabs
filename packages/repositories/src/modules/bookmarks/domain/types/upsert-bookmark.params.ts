export type UpsertBookmark_Params = {
  bookmark_id?: number
  created_at?: Date
  title: string
  is_public: boolean
  is_archived: boolean
  is_unread: boolean
  stars?: number
  tags: { name: string; is_public: boolean }[]
  links: { url: string; site_path?: string; is_public: boolean }[]
}