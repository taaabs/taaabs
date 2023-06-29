import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export class GetPublicBookmarks
  implements UseCase<Promise<BookmarksRo.Public>, BookmarksParams.Public>
{
  constructor(private readonly _bookmarksRepository: BookmarksRepository) {}

  public invoke(params: BookmarksParams.Public) {
    return this._bookmarksRepository.getPublic(params)
  }
}
