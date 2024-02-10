import { NewImport_Params } from '../types/new-import.params'

export type Import_Repository = {
  new_import(params: NewImport_Params): Promise<void>
}
