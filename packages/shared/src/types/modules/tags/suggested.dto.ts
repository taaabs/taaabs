import { system_values } from '../../../constants/system-values'
import { z } from 'zod'

export namespace Suggested_Dto {
  export namespace Request {
    const body_schema = z
      .array(z.number())
      .max(system_values.bookmark.tags.limit - 1)
    export type Body = z.infer<typeof body_schema>
  }
  export type Response = {
    recent: number[]
    frequent: number[]
  }
}
