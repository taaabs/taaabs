import { KyInstance } from 'ky'
import { Pinned_DataSource } from './pinned.data-source'
import { Pinned_Dto } from '@shared/types/modules/pinned/pinned.dto'
import { GetPinned_Params } from '../../domain/types/get-pinned.params'

export class Pinned_DataSourceImpl implements Pinned_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_pinned_authorized(): Promise<Pinned_Dto.Response> {
    return this._ky.get('v1/pinned').json()
  }

  public async get_pinned_public(
    params: GetPinned_Params.Public,
  ): Promise<Pinned_Dto.Response> {
    return this._ky.get(`v1/pinned/${params.username}`).json()
  }
}
