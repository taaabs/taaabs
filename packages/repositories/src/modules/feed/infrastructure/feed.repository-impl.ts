import { FeedLink_Entity } from '../domain/entities/feed-link.entity'
import { Feed_Repository } from '../domain/feed.repository'
import { GetFeed_Params } from '../domain/types/get-feed.params'
import { GetFeed_Ro } from '../domain/types/get-feed.ro'
import { Feed_DataSource } from './feed.data-source'

export class Feed_RepositoryImpl implements Feed_Repository {
  constructor(private readonly _feed_data_source: Feed_DataSource) {}

  async get_feed(params: GetFeed_Params): Promise<GetFeed_Ro> {
    const response = await this._feed_data_source.get_feed(params)

    return response.links.map((link) => {
      const created_by = response.users.find(
        (user) => user.id == link.created_by,
      )
      const followees = link.followees
        .map((followee_id) =>
          response.users.find((user) => user.id == followee_id),
        )

      return {
        ...link,
        created_by: created_by
          ? {
              username: created_by.username,
              display_name: created_by.display_name,
            }
          : undefined,
        followees,
      } as FeedLink_Entity
    })
  }
}
