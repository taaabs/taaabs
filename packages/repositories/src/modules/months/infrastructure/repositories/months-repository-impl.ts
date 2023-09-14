import { MonthsRepository } from '../../domain/repositories/months.repository'
import { MonthsParams } from '../../domain/types/months.params'
import { MonthsRo } from '../../domain/types/months.ro'
import { MonthsDataSource } from '../data-sources/months-data-source'

export class MonthsRepositoryImpl implements MonthsRepository {
  constructor(private readonly _months_data_source: MonthsDataSource) {}

  public async get_months_on_authorized_user(
    params: MonthsParams.Authorized,
  ): Promise<MonthsRo.Authorized> {
    const data =
      await this._months_data_source.get_months_on_authorized_user(params)

    return {
      created_at: Object.entries(data.created_at).reduce<
        MonthsRo.Authorized['updated_at']
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
        MonthsRo.Authorized['updated_at']
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
    params: MonthsParams.Public,
  ): Promise<MonthsRo.Public> {
    const data =
      await this._months_data_source.get_months_on_public_user(params)

    return {
      created_at: Object.entries(data.created_at).reduce<
        MonthsRo.Public['created_at']
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
        MonthsRo.Public['updated_at']
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
