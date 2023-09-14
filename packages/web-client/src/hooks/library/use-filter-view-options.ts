import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { updateSearchParam } from '@/utils/update-query-param'
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

  const setFilterQueryParam = (filter: LibraryFilter) => {
    let updatedQueryParams: any
    updatedQueryParams = updateSearchParam(
      query_params,
      'f',
      filter == BookmarksFetchingDefaults.Common.filter
        ? undefined
        : Object.values(LibraryFilter).indexOf(filter).toString(),
    )
    updatedQueryParams = updateSearchParam(updatedQueryParams, 't')

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
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

  const excludeNsfw = () => {
    switch (current_filter) {
      case LibraryFilter.All:
        setFilterQueryParam(LibraryFilter.AllNsfwExcluded)
        break
      case LibraryFilter.StarredOnly:
        setFilterQueryParam(LibraryFilter.StarredOnlyNsfwExcluded)
        break
      case LibraryFilter.Archived:
        setFilterQueryParam(LibraryFilter.ArchivedNsfwExcluded)
        break
    }
  }

  const includeNsfw = () => {
    switch (current_filter) {
      case LibraryFilter.AllNsfwExcluded:
        setFilterQueryParam(LibraryFilter.All)
        break
      case LibraryFilter.StarredOnlyNsfwExcluded:
        setFilterQueryParam(LibraryFilter.StarredOnly)
        break
      case LibraryFilter.ArchivedNsfwExcluded:
        setFilterQueryParam(LibraryFilter.Archived)
        break
    }
  }

  return {
    currentFilter: current_filter,
    setFilterQueryParam,
    excludeNsfw,
    includeNsfw,
    isNsfwExcluded: is_nsfw_excluded,
  }
}
