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
      monthsOfBookmarkCreation: data.months_of_bookmark_creation.map(
        (month) => ({
          yymm: month.yymm,
          tags: month.tags,
          bookmarkCount: month.bookmarks_count,
          nsfwCount: month.nsfw_count || null,
          publicCount: month.public_count || null,
          starredCount: month.starred_count || null,
        }),
      ),
      monthsOfUrlCreation: data.months_of_url_creation.map((month) => ({
        yymm: month.yymm,
        tags: month.tags,
        bookmarkCount: month.bookmarks_count,
        nsfwCount: month.nsfw_count || null,
        publicCount: month.public_count || null,
        starredCount: month.starred_count || null,
      })),
      isMonthsUpdateScheduled: data.is_months_update_scheduled,
    }
  }

  public async getMonthsOnPublicUser(
    params: MonthsParams.Public,
  ): Promise<MonthsRo.Public> {
    const data = await this._monthsDataSource.getMonthsOnPublicUser(params)

    return {
      monthsOfBookmarkCreation: data.months_of_bookmark_creation.map(
        (month) => ({
          yymm: month.yymm,
          tags: month.tags,
          bookmarkCount: month.bookmarks_count,
          nsfwCount: month.nsfw_count || null,
          starredCount: month.starred_count || null,
        }),
      ),
      monthsOfUrlCreation: data.months_of_bookmark_creation.map((month) => ({
        yymm: month.yymm,
        tags: month.tags,
        bookmarkCount: month.bookmarks_count,
        nsfwCount: month.nsfw_count || null,
        starredCount: month.starred_count || null,
      })),
      isMonthsUpdateScheduled: data.is_months_update_scheduled,
    }
  }
}
