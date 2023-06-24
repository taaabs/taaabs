import { BookmarksDto } from '@shared/dtos/v1/bookmarks/bookmarks-on-user.dto'
import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'

type Params = BookmarksDto.QueryParams.OnCurrentUser

export class GetBookmarksOnCurrentUser
  implements UseCase<Promise<BookmarksRo.OnCurrentUser>, Params>
{
  constructor(private readonly repository: BookmarksRepository) {}

  async invoke(params: Params) {
    return this.repository.getBookmarksOnCurrentUser({ params })
  }
}
