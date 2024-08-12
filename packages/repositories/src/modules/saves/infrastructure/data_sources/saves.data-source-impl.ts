import { KyInstance } from 'ky'
import { Saves_DataSource } from './saves.data-source'
import { GetSaves_Params } from '../../domain/types/get_saves.params'
import { GetSaves_Dto } from '@shared/types/modules/saves/get_saves.dto'

export class Saves_DataSourceImpl implements Saves_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_saves(
    params: GetSaves_Params,
  ): Promise<GetSaves_Dto.Response> {
    const search_params: GetSaves_Dto.SearchParams = {
      page: params.page,
      limit: params.limit,
    }

    try {
      const response = await this._ky.get(`v1/saves/${params.url_hash}`, {
        searchParams: JSON.parse(JSON.stringify(search_params)),
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching saves:', error)
      throw new Error('Failed to fetch saves')
    }
  }
}
