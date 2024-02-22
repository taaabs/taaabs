import { z } from 'zod'
import { data_schema } from './data'

export namespace DownloadBackup_Dto {
  export const response_schema = data_schema
  export type Response = z.infer<typeof response_schema>
}
