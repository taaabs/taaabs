import { z } from 'zod'

export const get_feed_params_schema = z.object({
  date_range: z
    .enum(['last_24h', 'last_week', 'last_month', 'last_72h'])
    .optional(),
})

export type GetFeed_Params = z.infer<typeof get_feed_params_schema>
