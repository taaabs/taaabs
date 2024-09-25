import { GetFeed_Params } from './types/get-feed.params'
import { GetFeed_Ro } from './types/get-feed.ro'

export interface Feed_Repository {
  get_feed(params: GetFeed_Params): Promise<GetFeed_Ro>
}
