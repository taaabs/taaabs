import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksOnUserDto } from '@shared/dtos/modules/bookmarks/bookmarks-on-user.dto'

type Params = BookmarksOnUserDto.QueryParams.OnOtherUser & { username: string }

export class GetBookmarksOnOtherUser
  implements UseCase<Promise<BookmarksRo.OnOtherUser>, Params>
{
  constructor(private readonly repository: BookmarksRepository) {}

  async invoke(params: Params) {
    return this.repository.getBookmarksOnOtherUser({
      params,
      username: params.username,
    })
  }
}
