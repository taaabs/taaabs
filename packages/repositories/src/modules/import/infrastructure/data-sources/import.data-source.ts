import { NewImport_Params } from '../../domain/types/new-import.params'

export type Import_DataSource = {
  new_import(params: NewImport_Params): Promise<void>
}
