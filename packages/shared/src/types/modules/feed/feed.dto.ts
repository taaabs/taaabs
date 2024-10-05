import { z } from 'zod'

export namespace Feed_Dto {
  export const search_params_schema = z.object({
    date_range: z
      .enum(['last_24h', 'last_week', 'last_month', 'last_72h'])
      .optional(),
  })
  export type SearchParams = z.infer<typeof search_params_schema>

  export type Response = {
    links: {
      title?: string
      url: string
      created_at: string // Original creation date of the link
      first_followee_created_at: string // Date when it was FIRST saved by followed users (used for sorting)
      followees: string[]
      saves?: number
      created_by?: string // First saver, not necessarily a followed user
      is_creator_followed?: boolean
    }[]
    users: {
      id: string
      username: string
      display_name?: string
    }[]
  }
}
