import { z } from 'zod'

export namespace LogIn_Dto {
  export namespace Request {
    export const body_schema = z.object({
      email: z.string().email(),
      password: z.string().length(64),
    })
    export type Body = z.infer<typeof body_schema>
  }

  export type Response = {
    access_token: string
    refresh_token: string
    username: string
  }
}
