import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksOnUserDto } from '@shared/dtos/modules/bookmarks/bookmarks-on-user.dto'

type Params = BookmarksOnUserDto.QueryParams.Authorized

export class GetAuthorizedBookmarks
  implements UseCase<Promise<BookmarksRo.Authorized>, Params>
{
  constructor(private readonly repository: BookmarksRepository) {}

  async invoke(params: Params) {
    return this.repository.getAuthorizedBookmarks({ params })
  }
}
