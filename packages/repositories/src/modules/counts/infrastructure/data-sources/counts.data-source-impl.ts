import { Counts_Dto } from '@shared/types/modules/counts/counts.dto'
import { Counts_Params } from '../../domain/types/counts.params'
import { Counts_DataSource } from './counts.data-source'
import { KyInstance } from 'ky'

export class Counts_DataSourceImpl implements Counts_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_counts_on_authorized_user(
    params: Counts_Params.Authorized,
  ): Promise<Counts_Dto.Response.Authorized> {
    const search_params: Counts_Dto.SearchParams.Authorized = {
      starred_only: params.starred_only,
      unsorted_only: params.unsorted_only,
      is_archived: params.is_archived,
      public_only: params.public_only,
      tags: params.tags?.join(','),
    }

    return this._ky
      .get('v1/counts', {
        searchParams: JSON.parse(JSON.stringify(search_params)),
      })
      .json()
  }

  public async get_counts_on_public_user(
    params: Counts_Params.Public,
  ): Promise<Counts_Dto.Response.Public> {
    const search_params: Counts_Dto.SearchParams.Public = {
      starred_only: params.starred_only,
      is_archived: params.is_archived,
      tags: params.tags?.join(','),
    }

    return this._ky(`v1/counts/${params.username}`, {
      searchParams: JSON.parse(JSON.stringify(search_params)),
    }).json()
  }
}
