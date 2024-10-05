export type FeedLink_Entity = {
  title?: string
  url: string
  created_at: string
  created_by?: {
    username: string
    display_name?: string
    is_followed: boolean
  }
  first_followee_created_at: string
  followees: {
    username: string
    display_name?: string
  }[]
  saves?: number
}
