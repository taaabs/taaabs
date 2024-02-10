import { Import_Repository } from '../../domain/repositories/import.repository'
import { NewImport_Params } from '../../domain/types/new-import.params'
import { Import_DataSource } from '../data-sources/import.data-source'

export class Import_RepositoryImpl implements Import_Repository {
  constructor(private readonly _import_data_source: Import_DataSource) {}

  public async new_import(params: NewImport_Params): Promise<void> {
    return this._import_data_source.new_import(params)
  }
}
