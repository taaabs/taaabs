import { Feed_Dto } from '@shared/types/modules/feed/feed.dto'
import { GetFeed_Params } from '../domain/types/get-feed.params'

export interface Feed_DataSource {
  get_feed(params: GetFeed_Params): Promise<Feed_Dto.Response>
}
