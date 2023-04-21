import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  CollectionType,
  StandardTypeVisibility,
  BookmarksOnCollections,
  Url,
  Host,
} from '@prisma/client'
import { parse } from 'uuid'

export type PublicBookmarksOnCollectionById = Array<
  {
    bookmarkOnCollection: Pick<
      BookmarksOnCollections,
      'customTitle' | 'customDescription'
    >
  } & {
    url: Pick<Url, 'url' | 'title' | 'description'>
  } & {
    host: Pick<Host, 'name' | 'host'>
  }
>

@Injectable()
export class CollectionsRepository {
  constructor(private readonly _prismaService: PrismaService) {}

  public async publicBookmarksOnCollectionById(
    collectionId: string,
  ): Promise<PublicBookmarksOnCollectionById> {
    try {
      const collection = await this._prismaService.collection.findFirstOrThrow({
        where: {
          AND: [
            { id: Buffer.from(parse(collectionId)) },
            { collectionType: CollectionType.STANDARD },
            { standardTypeVisibility: StandardTypeVisibility.PUBLIC },
          ],
        },
        select: {
          bookmarks: {
            select: {
              customTitle: true,
              customDescription: true,
              bookmark: {
                select: {
                  url: {
                    select: {
                      title: true,
                      description: true,
                      url: true,
                      host: { select: { name: true, host: true } },
                    },
                  },
                },
              },
            },
          },
        },
      })

      return collection.bookmarks.map((bookmark) => ({
        bookmarkOnCollection: {
          customTitle: bookmark.customTitle,
          customDescription: bookmark.customDescription,
        },
        host: {
          host: bookmark.bookmark.url.host.host,
          name: bookmark.bookmark.url.host.name,
        },
        url: {
          customTitle: bookmark.customTitle,
          customDescription: bookmark.customDescription,
          title: bookmark.bookmark.url.title,
          description: bookmark.bookmark.url.description,
          url: bookmark.bookmark.url.url,
          name: bookmark.bookmark.url.host.name,
          host: bookmark.bookmark.url.host.host,
        },
      }))
    } catch (error) {
      throw error
    }
  }
}
