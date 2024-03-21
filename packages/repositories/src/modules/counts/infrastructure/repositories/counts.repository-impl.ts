import { Counts_Repository } from '../../domain/repositories/counts.repository'
import { Counts_Params } from '../../domain/types/counts.params'
import { Counts_Ro } from '../../domain/types/counts.ro'
import { Counts_DataSource } from '../data-sources/counts.data-source'
import { Crypto } from '@repositories/utils/crypto'

export class Counts_RepositoryImpl implements Counts_Repository {
  constructor(private readonly _counts_data_source: Counts_DataSource) {}

  public async get_counts_on_authorized_user(
    params: Counts_Params.Authorized,
  ): Promise<Counts_Ro> {
    const result =
      await this._counts_data_source.get_counts_on_authorized_user(params)

    const key = await Crypto.derive_key_from_password('my_secret_key')

    return {
      months: result.months
        ? await async_reduce(
            Object.entries(result.months),
            async (acc, [k, v]) => ({
              ...acc,
              [k]: {
                bookmark_count: v.bookmark_count,
                starred_count: v.starred_count,
                unread_count: v.unread_count,
                tags: (
                  await Promise.all(
                    v.tags.map(async (tag) => ({
                      ...tag,
                      name: tag.name
                        ? tag.name
                        : await Crypto.AES.decrypt(tag.name_aes!, key),
                    })),
                  )
                ).reduce(
                  (acc, el) => ({
                    ...acc,
                    [el.name]: { id: el.id, yields: el.yields },
                  }),
                  {},
                ),
              },
            }),
            {},
          )
        : {},
      awaits_processing: result.awaits_processing,
    }
  }

  public async get_counts_on_public_user(
    params: Counts_Params.Public,
  ): Promise<Counts_Ro> {
    const result =
      await this._counts_data_source.get_counts_on_public_user(params)

    return {
      months: result.months
        ? Object.entries(result.months).reduce(
            (acc, [k, v]) => ({
              ...acc,
              [k]: {
                bookmark_count: v.bookmark_count,
                starred_count: v.starred_count,
                tags: v.tags.reduce(
                  (acc, el) => ({
                    ...acc,
                    [el.name]: { id: el.id, yields: el.yields },
                  }),
                  {},
                ),
              },
            }),
            {},
          )
        : {},
      awaits_processing: result.awaits_processing,
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
