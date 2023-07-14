import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export class GetBookmarksOnOtherUser
  implements UseCase<Promise<BookmarksRo.OtherUser>, BookmarksParams.OtherUser>
{
  constructor(private readonly _bookmarksRepository: BookmarksRepository) {}

  public invoke(params: BookmarksParams.OtherUser) {
    return this._bookmarksRepository.getBookmarksOnOtherUser(params)
  }
}
