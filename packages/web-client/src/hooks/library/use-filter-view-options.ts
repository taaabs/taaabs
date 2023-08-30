import { useShallowSearchParams } from '@web-ui/hooks/use-shallow-search-params'
import { updateSearchParam } from '@/utils/update-query-param'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'

export const useFilterViewOptions = () => {
  const queryParams = useShallowSearchParams()
  const [currentFilter, setCurrentFilter] = useState<LibraryFilter>(
    Object.values(LibraryFilter)[
      parseInt(
        queryParams.get('f') ||
          Object.values(LibraryFilter)
            .indexOf(BookmarksFetchingDefaults.Common.filter)
            .toString(),
      )
    ],
  )
  const [isNsfwExcluded, setIsNsfwExcluded] = useState<boolean>(
    currentFilter == LibraryFilter.AllNsfwExcluded ||
      currentFilter == LibraryFilter.ArchivedNsfwExcluded ||
      currentFilter == LibraryFilter.StarredOnlyNsfwExcluded,
  )

  useUpdateEffect(() => {
    const queryFilter = queryParams.get('f')

    if (
      queryFilter !=
      Object.values(LibraryFilter).indexOf(currentFilter).toString()
    ) {
      setCurrentFilter(
        Object.values(LibraryFilter)[
          parseInt(
            queryFilter ||
              Object.values(LibraryFilter)
                .indexOf(BookmarksFetchingDefaults.Common.filter)
                .toString(),
          )
        ],
      )
    }
  }, [queryParams])

  const setFilterQueryParam = (filter: LibraryFilter) => {
    let updatedQueryParams: any
    updatedQueryParams = updateSearchParam(
      queryParams,
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
      currentFilter == LibraryFilter.AllNsfwExcluded ||
      currentFilter == LibraryFilter.ArchivedNsfwExcluded ||
      currentFilter == LibraryFilter.StarredOnlyNsfwExcluded
    ) {
      setIsNsfwExcluded(true)
    } else {
      setIsNsfwExcluded(false)
    }
  }, [currentFilter])

  const excludeNsfw = () => {
    switch (currentFilter) {
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
    switch (currentFilter) {
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
    currentFilter,
    setFilterQueryParam,
    excludeNsfw,
    includeNsfw,
    isNsfwExcluded,
  }
}
