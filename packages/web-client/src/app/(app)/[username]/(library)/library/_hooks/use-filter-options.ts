import { updateQueryParam } from '@/utils/update-query-param'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export const useFilterOptions = () => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
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
      currentFilter == LibraryFilter.ArchivedOnlyNsfwExcluded ||
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
    const updatedQueryParam = updateQueryParam(
      queryParams,
      'f',
      Object.values(LibraryFilter).indexOf(filter).toString(),
    )

    router.push(`/${params.username}/library?${updatedQueryParam}`, {
      scroll: false,
    })
  }

  useUpdateEffect(() => {
    if (
      currentFilter == LibraryFilter.AllNsfwExcluded ||
      currentFilter == LibraryFilter.ArchivedOnlyNsfwExcluded ||
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
      case LibraryFilter.ArchivedOnly:
        setFilterQueryParam(LibraryFilter.ArchivedOnlyNsfwExcluded)
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
      case LibraryFilter.ArchivedOnlyNsfwExcluded:
        setFilterQueryParam(LibraryFilter.ArchivedOnly)
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
