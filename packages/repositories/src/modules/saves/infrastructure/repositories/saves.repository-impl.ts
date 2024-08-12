import { Saves_Repository } from '../../domain/repositories/saves.repository'
import { GetSaves_Params } from '../../domain/types/get_saves.params'
import { GetSaves_Ro } from '../../domain/types/get_saves.ro'
import { Saves_DataSource } from '../data_sources/saves.data-source'

export class Saves_RepositoryImpl implements Saves_Repository {
  constructor(private readonly _saves_data_source: Saves_DataSource) {}

  public async get_saves(params: GetSaves_Params): Promise<GetSaves_Ro> {
    return this._saves_data_source.get_saves(params).then((result) =>
      result.map((user) => ({
        username: user.username,
        display_name: user.display_name,
        saved_at: user.saved_at,
        is_following: user.is_following,
      })),
    )
  }
}
