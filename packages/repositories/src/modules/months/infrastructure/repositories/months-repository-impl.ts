import { MonthsRepository } from '../../domain/repositories/months.repository'
import { MonthsParams } from '../../domain/types/months.params'
import { MonthsRo } from '../../domain/types/months.ro'
import { MonthsDataSource } from '../data-sources/months-data-source'

export class MonthsRepositoryImpl implements MonthsRepository {
  constructor(private readonly _monthsDataSource: MonthsDataSource) {}

  public async getMonthsOnAuthorizedUser(
    params: MonthsParams.Authorized,
  ): Promise<MonthsRo.Authorized> {
    const data = await this._monthsDataSource.getMonthsOnAuthorizedUser(params)

    return {
      monthsOfBookmarkCreation: Object.entries(
        data.created_at,
      ).reduce<MonthsRo.Authorized['monthsOfBookmarkCreation']>(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            tags: { ...v.tags },
            bookmarkCount: v.bookmark_count,
            starredCount: v.starred_count || null,
            nsfwCount: v.nsfw_count || null,
            publicCount: v.public_count || null,
          },
        }),
        {},
      ),
      monthsOfUrlCreation: Object.entries(data.updated_at).reduce<
        MonthsRo.Authorized['monthsOfUrlCreation']
      >(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            tags: { ...v.tags },
            bookmarkCount: v.bookmark_count,
            starredCount: v.starred_count || null,
            nsfwCount: v.nsfw_count || null,
            publicCount: v.public_count || null,
          },
        }),
        {},
      ),
      isMonthsUpdateScheduled: data.is_months_update_scheduled,
    }
  }

  public async getMonthsOnPublicUser(
    params: MonthsParams.Public,
  ): Promise<MonthsRo.Public> {
    const data = await this._monthsDataSource.getMonthsOnPublicUser(params)

    return {
      monthsOfBookmarkCreation: Object.entries(
        data.created_at,
      ).reduce<MonthsRo.Public['monthsOfBookmarkCreation']>(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            tags: { ...v.tags },
            bookmarkCount: v.bookmark_count,
            starredCount: v.starred_count || null,
            nsfwCount: v.nsfw_count || null,
          },
        }),
        {},
      ),
      monthsOfUrlCreation: Object.entries(data.updated_at).reduce<
        MonthsRo.Public['monthsOfUrlCreation']
      >(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            tags: { ...v.tags },
            bookmarkCount: v.bookmark_count,
            starredCount: v.starred_count || null,
            nsfwCount: v.nsfw_count || null,
          },
        }),
        {},
      ),
      isMonthsUpdateScheduled: data.is_months_update_scheduled,
    }
  }
}
