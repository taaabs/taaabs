import { z } from 'zod'

export namespace GuestSignUp_Dto {
  export namespace Request {
    export const body_schema = z.object({
      captcha_token: z.string(),
    })
    export type Body = z.infer<typeof body_schema>
  }

  export type Response = {
    guest_key: string
    access_token: string
    refresh_token: string
    id: string
  }
}
