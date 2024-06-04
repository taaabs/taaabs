type PinnedItem = {
  url: string
  title?: string
  is_public?: boolean
}
export type UpdatePinned_Params = {
  items: PinnedItem[]
}
