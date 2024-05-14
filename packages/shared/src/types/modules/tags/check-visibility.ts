import { z } from 'zod'

export namespace CheckVisibility_Dto {
  export namespace Request {
    export const body_schema = z.object({
      hash: z.string().length(64),
    })
    export type Body = z.infer<typeof body_schema>
  }
  export type Response = {
    is_public: boolean
  }
}
