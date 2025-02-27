import { Counts_Repository } from '../../domain/repositories/counts.repository'
import { Counts_Params } from '../../domain/types/counts.params'
import { Counts_Ro } from '../../domain/types/counts.ro'
import { Counts_DataSource } from '../data-sources/counts.data-source'
import { AES } from '@repositories/utils/aes'

export class Counts_RepositoryImpl implements Counts_Repository {
  constructor(private readonly _counts_data_source: Counts_DataSource) {}

  public async get_counts_on_authorized_user(
    params: Counts_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<Counts_Ro> {
    const result = await this._counts_data_source.get_counts_on_authorized_user(
      params,
    )

    return {
      months: result.months
        ? await async_reduce(
            Object.entries(result.months),
            async (acc, [k, v]) => ({
              ...acc,
              [k]: {
                bookmark_count: v.bookmark_count,
                starred_count: v.starred_count,
                unsorted_count: v.unsorted_count,
                tags: (
                  await Promise.all(
                    v.tags.map(async (tag) => ({
                      ...tag,
                      name: tag.name
                        ? tag.name
                        : await AES.decrypt(
                            tag.name_aes!,
                            encryption_key,
                          ),
                    })),
                  )
                ).reduce(
                  (acc, el) => ({
                    ...acc,
                    [el.id]: { name: el.name, yields: el.yields },
                  }),
                  {},
                ),
              },
            }),
            {},
          )
        : {},
    }
  }

  public async get_counts_on_public_user(
    params: Counts_Params.Public,
  ): Promise<Counts_Ro> {
    const result = await this._counts_data_source.get_counts_on_public_user(
      params,
    )

    return {
      months: result.months
        ? Object.entries(result.months).reduce(
            (acc, [k, v]) => ({
              ...acc,
              [k]: {
                bookmark_count: v.bookmark_count,
                starred_count: v.starred_count,
                tags: v.tags.reduce((acc, el) => {
                  return {
                    ...acc,
                    [el.id]: { name: el.name, yields: el.yields },
                  }
                }, {}),
              },
            }),
            {},
          )
        : {},
    }
  }
}

async function async_reduce<T, U>(
  array: T[],
  reducer: (accumulator: U, current_value: T) => Promise<U>,
  initial_value: U,
): Promise<U> {
  let accumulator = initial_value
  for (const current_value of array) {
    accumulator = await reducer(accumulator, current_value)
  }
  return accumulator
}
