import { z } from 'zod'

export namespace CheckTotalGivenPoints_Dto {
  export class Response {
    public points: number
  }
  export namespace Request {
    export const body_schema = z.object({
      receiver_username: z.string().toLowerCase(),
      bookmark_id: z.number(),
    })
    export type Body = z.infer<typeof body_schema>
  }
}
