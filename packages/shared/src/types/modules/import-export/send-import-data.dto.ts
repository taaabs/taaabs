import { z } from 'zod'
import { data_schema } from './data'

export namespace SendImportData_Dto {
  const options = z.object({
    erase_library: z.boolean().optional(),
  })
  export const body_schema = data_schema.and(options)
  export type Body = z.infer<typeof body_schema>
}
