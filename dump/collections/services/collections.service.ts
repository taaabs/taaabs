import { Injectable } from '@nestjs/common'
import { PublicCollectionDataResponseDto } from '@taaabs/shared'
import { CollectionsRepository } from '../repositories/collections.repository'

@Injectable()
export class CollectionsService {
  constructor(private readonly _collectionsRepository: CollectionsRepository) {}

  public async getPublicCollectionData({
    collectionId,
  }: {
    collectionId: string
  }): Promise<PublicCollectionDataResponseDto> {
    try {
      const bookmarks =
        await this._collectionsRepository.publicBookmarksOnCollectionById(
          collectionId,
        )

      return {
        bookmarks: bookmarks.map(({ bookmarkOnCollection, url, host }) => ({
          url: url.url,
          title: bookmarkOnCollection.customTitle
            ? bookmarkOnCollection.customTitle
            : url.title,
          description: bookmarkOnCollection.customDescription
            ? bookmarkOnCollection.customDescription
            : url.description,
          host: host.host,
        })),
        hosts: Object.assign(
          {},
          ...bookmarks.map(({ host }) => ({
            [host.host]: { name: host.name },
          })),
        ),
      }
    } catch (error) {
      throw error
    }
  }
}
