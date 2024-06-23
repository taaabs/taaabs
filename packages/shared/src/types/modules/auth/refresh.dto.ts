import { z } from 'zod'

export namespace Refresh_Dto {
  export namespace Request {
    export const body_schema = z.object({
      access_token: z.string(),
      refresh_token: z.string().length(64),
    })
    export type Body = z.infer<typeof body_schema>
  }

  export type Response = {
    access_token: string
    refresh_token: string
  }
}
