import { updateQueryParam } from '@/utils/update-query-param'
import { LibraryFilter } from '@shared/types/common/library-filter'
import useToggle from 'beautiful-react-hooks/useToggle'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export const useFilterOptions = (initFilter: LibraryFilter) => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [isNsfwExcluded, toggleIsNsfwExcluded] = useToggle(
    initFilter == LibraryFilter.AllNsfwExcluded ||
      initFilter == LibraryFilter.StarredOnlyNsfwExcluded ||
      initFilter == LibraryFilter.ArchivedOnlyNsfwExcluded,
  )
  const [selectedFilter, setFilter] = useState<LibraryFilter>(initFilter)

  useUpdateEffect(() => {
    const updatedQueryParams = updateQueryParam(
      queryParams,
      'f',
      Object.values(LibraryFilter).indexOf(selectedFilter).toString(),
    )
    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }, [selectedFilter])

  useUpdateEffect(() => {
    if (isNsfwExcluded) {
      switch (selectedFilter) {
        case LibraryFilter.All:
          setFilter(LibraryFilter.AllNsfwExcluded)
          break
        case LibraryFilter.StarredOnly:
          setFilter(LibraryFilter.StarredOnlyNsfwExcluded)
          break
        case LibraryFilter.ArchivedOnly:
          setFilter(LibraryFilter.ArchivedOnlyNsfwExcluded)
          break
      }
    } else {
      switch (selectedFilter) {
        case LibraryFilter.AllNsfwExcluded:
          setFilter(LibraryFilter.All)
          break
        case LibraryFilter.StarredOnlyNsfwExcluded:
          setFilter(LibraryFilter.StarredOnly)
          break
        case LibraryFilter.ArchivedOnlyNsfwExcluded:
          setFilter(LibraryFilter.ArchivedOnly)
          break
      }
    }
  }, [isNsfwExcluded])

  return {
    selectedFilter,
    setFilter,
    isNsfwExcluded,
    toggleExcludeNsfw: toggleIsNsfwExcluded,
  }
}
