import { z } from 'zod'

export namespace GuestSignUp_Dto {
  export namespace Request {
    export const body_schema = z.object({
      guest_token: z.string().uuid(),
      captcha_token: z.string(),
    })
    export type Body = z.infer<typeof body_schema>
  }

  export type Response = {
    access_token: string
    refresh_token: string
    id: string
  }
}
