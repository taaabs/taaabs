import { KyInstance } from 'ky';
import { Feed_DataSource } from './feed.data-source';
import { GetFeed_Params } from '../domain/types/get-feed.params'
import { Feed_Dto } from '@shared/types/modules/feed/feed.dto'


export class FeedDataSourceImpl implements Feed_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  async get_feed(params: GetFeed_Params): Promise<Feed_Dto.Response> {
    return this._ky.get('v1/feed', { searchParams: params }).json();
  }
}