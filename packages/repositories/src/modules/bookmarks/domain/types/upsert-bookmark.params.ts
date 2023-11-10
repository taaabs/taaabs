export type UpsertBookmark_Params = {
  bookmark_id?: string
  created_at?: Date
  title: string
  is_public: boolean
  is_archived: boolean
  is_starred: boolean
  is_unread: boolean
  tags: { name: string; is_public: boolean }[]
  links: { url: string; site_path: string; is_public: boolean }[]
}
