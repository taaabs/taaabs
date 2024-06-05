import { system_values } from '../../../../src/constants/system-values'
import { z } from 'zod'

export namespace GivePoints_Dto {
  export namespace Request {
    export const body_schema = z.object({
      receiver_username: z.string().toLowerCase(),
      bookmark_id: z.number(),
      points: z.number().max(system_values.bookmark.points.limit_per_user),
    })
    export type Body = z.infer<typeof body_schema>
  }
}
