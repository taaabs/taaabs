import { system_values } from '@shared/constants/system-values'
import { z } from 'zod'

export namespace SignUp_Dto {
  export namespace Request {
    export const body_schema = z.object({
      email: z.string().email(),
      username: z
        .string()
        .min(system_values.username_min_length)
        .max(system_values.username_max_length),
      password: z.string().length(system_values.password_hash_length),
      hint: z.string().max(system_values.password_hint_max_length).optional(),
    })
    export type Body = z.infer<typeof body_schema>
  }

  export type Response = {
    access_token: string
    refresh_token: string
    username: string
  }
}
