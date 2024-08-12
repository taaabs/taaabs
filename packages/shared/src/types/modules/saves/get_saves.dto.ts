import { z } from 'zod'

export namespace GetSaves_Dto {
  export const search_params = z.object({
    page: z.number().int().optional(),
    limit: z.number().int().optional(),
  })
  export type SearchParams = z.infer<typeof search_params>

  export type Response = {
    username: string
    display_name?: string
    saved_at: string
    is_following?: boolean
  }[]
}
