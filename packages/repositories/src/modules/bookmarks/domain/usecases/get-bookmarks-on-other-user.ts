import { BookmarksDto } from '@shared/dtos/v1/bookmarks/bookmarks-on-user.dto'
import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'

type Params = BookmarksDto.QueryParams.OnOtherUser & { username: string }

export class GetBookmarksOnOtherUser
  implements UseCase<Promise<BookmarksRo.OnOtherUser>, Params>
{
  constructor(private repository: BookmarksRepository) {}

  async invoke(params: Params) {
    return this.repository.getBookmarksOnOtherUser({
      params,
      username: params.username,
    })
  }
}
