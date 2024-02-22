import { z } from 'zod'
import { data_schema } from './data'

export namespace SendImportData_Dto {
  export const body_schema = data_schema
  export type Body = z.infer<typeof data_schema>
}
