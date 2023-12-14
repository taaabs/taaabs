import { Counts_Repository } from '../../domain/repositories/counts.repository'
import { Counts_Params } from '../../domain/types/counts.params'
import { Counts_Ro } from '../../domain/types/counts.ro'
import { Counts_DataSource } from '../data-sources/counts.data-source'
import CryptoJS from 'crypto-js'

export class Counts_RepositoryImpl implements Counts_Repository {
  constructor(private readonly _counts_data_source: Counts_DataSource) {}

  public async get_counts_on_authorized_user(
    params: Counts_Params.Authorized,
  ): Promise<Counts_Ro> {
    const data =
      await this._counts_data_source.get_counts_on_authorized_user(params)

    return {
      months: Object.entries(data.months).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            bookmark_count: v.bookmark_count,
            starred_count: v.starred_count,
            unread_count: v.unread_count,
            tags: Object.entries(v.tags).reduce(
              (acc, [k, v]) => ({
                ...acc,
                [CryptoJS.AES.decrypt(k, 'my_secret_key').toString(
                  CryptoJS.enc.Utf8,
                )]: v,
              }),
              {},
            ),
          },
        }),
        {},
      ),
      is_counts_update_scheduled: data.is_counts_update_scheduled,
    }
  }

  public async get_counts_on_public_user(
    params: Counts_Params.Public,
  ): Promise<Counts_Ro> {
    const data =
      await this._counts_data_source.get_counts_on_public_user(params)

    return {
      months: data.months,
      is_counts_update_scheduled: data.is_counts_update_scheduled,
    }
  }
}
