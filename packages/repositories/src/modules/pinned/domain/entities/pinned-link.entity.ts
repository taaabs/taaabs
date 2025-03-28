export type PinnedLink_Entity = {
  bookmark_id: number
  created_at: string
  updated_at: string
  is_public?: boolean
  url: string
  title?: string
  stars?: number
  is_unsorted?: boolean
  is_archived?: boolean
  tags?: number[]
  open_snapshot?: boolean
  favicon?: string
}
