export type UpsertBookmark_Params = {
  bookmark_id_?: number
  is_public_: boolean
  created_at_?: Date
  title_?: string
  note_?: string
  is_archived_: boolean
  is_unread_: boolean
  stars_?: number
  tags_: { name_: string; is_public_?: boolean }[]
  links_: {
    url_: string
    site_path_?: string
    is_public_: boolean
    is_pinned_?: boolean
    pin_title_?: string
    via_wayback_?: boolean
  }[]
}
