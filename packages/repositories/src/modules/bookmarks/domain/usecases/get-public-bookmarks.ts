import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksDto } from '@shared/dtos/modules/bookmarks/bookmarks.dto'

type Params = BookmarksDto.QueryParams.Public & { username: string }

export class GetPublicBookmarks
  implements UseCase<Promise<BookmarksRo.Public>, Params>
{
  constructor(private readonly repository: BookmarksRepository) {}

  async invoke(params: Params) {
    return this.repository.getPublicBookmarks({
      params,
      username: params.username,
    })
  }
}
