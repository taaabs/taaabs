import { Months_Repository } from '../../domain/repositories/months.repository'
import { Months_Params } from '../../domain/types/months.params'
import { Months_Ro } from '../../domain/types/months.ro'
import { Months_DataSource } from '../data-sources/months.data-source'

export class Months_RepositoryImpl implements Months_Repository {
  constructor(private readonly _months_data_source: Months_DataSource) {}

  public async get_months_on_authorized_user(
    params: Months_Params.Authorized,
  ): Promise<Months_Ro.Authorized> {
    const data =
      await this._months_data_source.get_months_on_authorized_user(params)

    return {
      created_at: Object.entries(data.created_at).reduce<
        Months_Ro.Authorized['updated_at']
      >(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            tags: { ...v.tags },
            bookmark_count: v.bookmark_count,
            starred_count: v.starred_count || null,
            nsfw_count: v.nsfw_count || null,
            public_count: v.public_count || null,
          },
        }),
        {},
      ),
      updated_at: Object.entries(data.updated_at).reduce<
        Months_Ro.Authorized['updated_at']
      >(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            tags: { ...v.tags },
            bookmark_count: v.bookmark_count,
            starred_count: v.starred_count || null,
            nsfw_count: v.nsfw_count || null,
            public_count: v.public_count || null,
          },
        }),
        {},
      ),
      is_months_update_scheduled: data.is_months_update_scheduled,
    }
  }

  public async get_months_on_public_user(
    params: Months_Params.Public,
  ): Promise<Months_Ro.Public> {
    const data =
      await this._months_data_source.get_months_on_public_user(params)

    return {
      created_at: Object.entries(data.created_at).reduce<
        Months_Ro.Public['created_at']
      >(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            tags: { ...v.tags },
            bookmark_count: v.bookmark_count,
            starred_count: v.starred_count || null,
            nsfw_count: v.nsfw_count || null,
          },
        }),
        {},
      ),
      updated_at: Object.entries(data.updated_at).reduce<
        Months_Ro.Public['updated_at']
      >(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            tags: { ...v.tags },
            bookmark_count: v.bookmark_count,
            starred_count: v.starred_count || null,
            nsfw_count: v.nsfw_count || null,
          },
        }),
        {},
      ),
      is_months_update_scheduled: data.is_months_update_scheduled,
    }
  }
}
