import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { update_query_params } from '@/utils/update-query-params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'

export const use_filter_view_options = () => {
  const query_params = use_shallow_search_params()
  const [current_filter, set_current_filter] = useState<LibraryFilter>(
    Object.values(LibraryFilter)[
      parseInt(
        query_params.get('f') ||
          Object.values(LibraryFilter)
            .indexOf(BookmarksFetchingDefaults.Common.filter)
            .toString(),
      )
    ],
  )
  const [is_nsfw_excluded, set_is_nsfw_excluded] = useState<boolean>(
    current_filter == LibraryFilter.AllNsfwExcluded ||
      current_filter == LibraryFilter.ArchivedNsfwExcluded ||
      current_filter == LibraryFilter.StarredOnlyNsfwExcluded,
  )

  useUpdateEffect(() => {
    const query_filter = query_params.get('f')

    if (
      query_filter !=
      Object.values(LibraryFilter).indexOf(current_filter).toString()
    ) {
      set_current_filter(
        Object.values(LibraryFilter)[
          parseInt(
            query_filter ||
              Object.values(LibraryFilter)
                .indexOf(BookmarksFetchingDefaults.Common.filter)
                .toString(),
          )
        ],
      )
    }
  }, [query_params])

  const set_filter_query_param = (filter: LibraryFilter) => {
    let updated_query_params: any
    updated_query_params = update_query_params(
      query_params,
      'f',
      filter == BookmarksFetchingDefaults.Common.filter
        ? undefined
        : Object.values(LibraryFilter).indexOf(filter).toString(),
    )
    updated_query_params = update_query_params(updated_query_params, 't')
    updated_query_params = update_query_params(updated_query_params, 'gte')
    updated_query_params = update_query_params(updated_query_params, 'lte')

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  useUpdateEffect(() => {
    if (
      current_filter == LibraryFilter.AllNsfwExcluded ||
      current_filter == LibraryFilter.ArchivedNsfwExcluded ||
      current_filter == LibraryFilter.StarredOnlyNsfwExcluded
    ) {
      set_is_nsfw_excluded(true)
    } else {
      set_is_nsfw_excluded(false)
    }
  }, [current_filter])

  const exclude_nsfw = () => {
    switch (current_filter) {
      case LibraryFilter.All:
        set_filter_query_param(LibraryFilter.AllNsfwExcluded)
        break
      case LibraryFilter.StarredOnly:
        set_filter_query_param(LibraryFilter.StarredOnlyNsfwExcluded)
        break
      case LibraryFilter.Archived:
        set_filter_query_param(LibraryFilter.ArchivedNsfwExcluded)
        break
    }
  }

  const include_nsfw = () => {
    switch (current_filter) {
      case LibraryFilter.AllNsfwExcluded:
        set_filter_query_param(LibraryFilter.All)
        break
      case LibraryFilter.StarredOnlyNsfwExcluded:
        set_filter_query_param(LibraryFilter.StarredOnly)
        break
      case LibraryFilter.ArchivedNsfwExcluded:
        set_filter_query_param(LibraryFilter.Archived)
        break
    }
  }

  return {
    current_filter,
    set_filter_query_param,
    exclude_nsfw,
    include_nsfw,
    is_nsfw_excluded,
  }
}
